const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelper");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = "vfCT5mYblPd5LyyNV4VO";
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

async function GetGeoData(location) {
  try {
    const geoData = await maptilerClient.geocoding.forward(location, {
      limit: 1,
    });
    // console.log(geoData); // Log the geocoding data
    return geoData.features[0].geometry;
    // maptilerClient.staticMaps.centered(eoData.features[0].geometry);
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
  }
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const location = `${cities[random1000].city}, ${cities[random1000].state}`;
    const geoData = await GetGeoData(location);
    console.log("geo data is");
    console.log(geoData);
    console.log("++++++");
    const camp = new Campground({
      author: "6640e84633595743e8236152",
      location: location,
      geometry: geoData,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dnpvot84z/image/upload/v1717261009/YelpCamp/fkegld5s2dofxhwhfn2l.jpg",
          filename: "YelpCamp/fkegld5s2dofxhwhfn2l",
        },
        {
          url: "https://res.cloudinary.com/dnpvot84z/image/upload/v1717261009/YelpCamp/zqy5ozsfh5gaweliw8si.jpg",
          filename: "YelpCamp/zqy5ozsfh5gaweliw8si",
        },
      ],
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur deserunt voluptas aut cupiditate minima temporibus laborum vel, delectus neque quisquam laboriosam voluptates quas possimus id esse obcaecati nobis, ratione atque?",
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
