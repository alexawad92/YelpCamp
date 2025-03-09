if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const morgan = require("morgan");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const campgroundRoutes = require("./routes/campground");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//
// connect to mongo
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected!");
});

// set up express app
const app = express();



// setup express
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie:{
    //                    ms     s    m    h    d => set to expire in a week
    httpOnly:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}
app.use(session(sessionConfig));
app.use(flash());


// use poassport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//campground route
app.use("/campgrounds", campgroundRoutes);

app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.use("/", userRoutes);
app.get("/", (req, res, next) => {
  res.render("home.ejs");
});





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
