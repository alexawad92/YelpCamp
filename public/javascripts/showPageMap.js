maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS.DARK,
  center: campground.geometry.coordinates,
  zoom: 10, // starting zoom
});
// map.setStyle(MapStyle.STREETS.DARK);
new maptilersdk.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
  )
  .addTo(map);
