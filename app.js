const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Campground = require("./models/Campground");
const Review = require("./models/review");
const catchAsync = require("./utils/catchAsync");
const morgan = require("morgan");
const ExpressError = require("./utils/ExpressError");
const {campgroundSchema, reviewSchema} = require('./schemas.js');
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected!");
});

const app = express();
// setup express
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ exteneded: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));



// middleware 

const validateCampground = (req, res, next)=>{
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map(el=>el.message).join(',');
    throw new ExpressError(message, 400);
  }
  else{
    next();
  }
}
  
  const validateReview = (req, res, next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const message = error.details.map(el=>el.message).join(',');
      throw new ExpressError(message, 400);
    }
    else{
      next();
    }
  }




app.get("/", (req, res, next) => {
  res.render("home.ejs");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get(
  "/campgrounds/new",
  catchAsync(async (req, res, next) => {
    res.render("campgrounds/new");
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

app.post(
  "/campgrounds",
  validateCampground,catchAsync(async (req, res, next) => {
   
    const { campground } = req.body;
    // if (!campground) {
    //   throw new ExpressError("Invalid Campground data", 404);
    // }
    console.log(campground);
    const camp = new Campground(campground);
    await camp.save();
    console.log(camp._id);
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

app.post(
  "/campgrounds/:id/reviews",
  validateReview,catchAsync(async (req, res, next) => {
    const { review } = req.body;
    const { id } = req.params;
    
    const newReview = new Review(review);
    const camp = await Campground.findById(id);
    console.log("camp found is " + camp)
    camp.reviews.push(newReview);
    await newReview.save();
    await camp.save();
    res.redirect(`/campgrounds/${id}`);

  })
);

app.put(
  "/campgrounds/:id",
  validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(id);
    res.redirect(`/campgrounds/${id}`);
  })
);


// every request for all paths
app.all("*", (req, res, next) => {
  console.log("I am in all ");
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  console.log("I am in use 169 ");
  const { statusCode = 500, message = "Something wend wrong!" } = err;
  if (!err.message) {
    err.message = "Something wend wrong!";
  }
  res.status(statusCode).render("error.ejs", { err });
});

// listen to //localhost:3000
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
