maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
  container: "map",
  // style: maptilersdk.MapStyle.STREETS.DARK,
  center: campground.geometry.coordinates,
  zoom: 5, // starting zoom
  geolocateControl: false,
});
map.setStyle(maptilersdk.MapStyle.STREETS.DARK);
new maptilersdk.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
  )
  .addTo(map);
