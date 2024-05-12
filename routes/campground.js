const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

router.get("/", catchAsync(campgrounds.index));

// Render new campground form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

// Show campground
router.get("/:id", catchAsync(campgrounds.showCampground));

// Render edit campground form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

// Create campground
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

// Update campground
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

// Delete campground
router.delete("/:id", isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
