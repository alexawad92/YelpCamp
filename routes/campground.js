const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

router.route('/')
  .get(catchAsync(campgrounds.index))
   // Create campground
  .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// Render new campground form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
  // Show campground
  .get(catchAsync(campgrounds.showCampground))
  // Update campground
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
  // Delete campground
  .delete(isAuthor, catchAsync(campgrounds.deleteCampground));

// Render edit campground form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);


module.exports = router;
