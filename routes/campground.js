const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const {isLoggedIn,validateCampground, isAuthor} = require("../middleware");


router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get(
  "/new", isLoggedIn,
  catchAsync(async (req, res, next) => {
    res.render("campgrounds/new");
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate(
      {
        path:"reviews",
        populate: {
          path: "author"
      }
    }).populate(
      {
        path: "author"
      });
    if(!campground){
        req.flash('error', "Cannot find campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground});
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
      req.flash('error', "Cannot find campground");
      return res.redirect("/campgrounds");
  }
    res.render("campgrounds/edit", { campground });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    
    const { campground } = req.body;
    console.log("campground is ", campground);
    campground.author = req.user._id;
    // if (!campground) {
    //   throw new ExpressError("Invalid Campground data", 404);
    // }
    console.log(campground);
    const camp = new Campground(campground);
    await camp.save();
    console.log(camp._id);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground,});
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.delete(
  "/:id",
  isAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect("/campgrounds");
  })
);

module.exports = router;
