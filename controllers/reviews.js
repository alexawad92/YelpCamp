const Review = require("../models/review.js");
const Campground = require("../models/campground");

module.exports.createReview = async (req, res, next) => {
  const { review } = req.body;
  const { id } = req.params;

  console.log("review.author " + review.author);
  const newReview = new Review(review);
  newReview.author = req.user._id;
  const camp = await Campground.findById(id);
  console.log("camp found is " + camp);
  camp.reviews.push(newReview);
  await newReview.save();
  await camp.save();
  req.flash("success", "Successfully created new review!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/campgrounds/${id}`);
};
