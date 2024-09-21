const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = "vfCT5mYblPd5LyyNV4VO";

async function GetData() {
  try {
    const geoData = await maptilerClient.geocoding.forward("Knoxville, TN", {
      limit: 1,
    });
    console.log(geoData); // Log the geocoding data
    console.log(geoData.features[0].geometry);
    // maptilerClient.staticMaps.centered(eoData.features[0].geometry);
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
  }
}

GetData();
// const map = new maptilerClient.Map({
//   container: "map", // container's id or the HTML element to render the map
//   style: maptilerClient.MapStyle.STREETS,
//   center: [-97.7485, 30.2711], // starting position [lng, lat]
//   zoom: 11.7, // starting zoom
// });
// console.log(map);
