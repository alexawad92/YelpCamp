const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.route('/')
  .get(catchAsync(campgrounds.index))
   // Create campground
  .post(isLoggedIn, upload.array('image') ,catchAsync(campgrounds.createCampground));
  // .post(upload.single('image'),(req, res)=>{
  //   console.log(req.file);
  //   res.send("req.file")
  // })

// Render new campground form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
  // Show campground
  .get(catchAsync(campgrounds.showCampground))
  // Update campground
  .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.updateCampground))
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
