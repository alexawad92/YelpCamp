const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = async (req, res, next) => {
  res.render("campgrounds/new");
  // here
};

module.exports.createCampground = async (req, res, next) => {
  const { campground } = req.body;
  campground.author = req.user._id;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  // console.log(geoData.features[0].geometry);
  // send(geoData.features[0].geometry);
  campground.geometry = geoData.features[0].geometry;
  console.log("campground is ", campground);
  const camp = new Campground(campground);
  await camp.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate({
      path: "author",
    });
  if (!campground) {
    req.flash("error", "Cannot find campground");
    return res.redirect("/campgrounds");
  }

  const imageLink = maptilerClient.staticMaps.centered(
    // center position (Boston)
    [35.96100118443384, -83.90229795657056],

    // zoom level
    12.5,

    // Options
    {
      // Request a hiDPI/Retina image
      hiDPI: true,

      // Output image size
      width: 1000,
      height: 1000,

      // Map style
      style: "streets-v2",
    }
  );

  console.log(imageLink);
  res.render("campgrounds/show", { campground, imageLink });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  console.log(req.body);
  // const checkedImages = req.body.
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });


  var newlocation = req.body.campground.location;
  console.log(newlocation);
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  campground.geometry = geoData.features[0].geometry;

  campground.images.push(...imgs);
  campground.save();
  if (req.body.deletedImages) {
    for (let filename of req.body.deletedImages) {
      console.log("deleting " + filename);
      await cloudinary.uploader.destroy(filename);
    }
    // delete images that their filename is in req.body.deletedImages
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deletedImages } } },
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};
