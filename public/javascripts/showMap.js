
// // public/javascripts/showMap.js

// // 1. Log your incoming data
// console.log('API key:', maptilerApiKey);
// console.log('campground object:', campground);
// console.log('geometry field:', campground.geometry);
// console.log('coordinates field:', campground.geometry?.coordinates);

// // 2. Coerce into the right shape
// let coords = campground.geometry?.coordinates;
// if (!Array.isArray(coords) || coords.length !== 2) {
//   throw new Error('Invalid coords shape – expected [lng, lat], got: ' + JSON.stringify(coords));
// }
// coords = coords.map(Number); // ensure they’re numbers, not strings

// // 3. Now init the map
// maptilersdk.config.apiKey = maptilerApiKey;
// const map = new maptilersdk.Map({
//   container: 'map',
//   style: maptilersdk.MapStyle.BRIGHT,
//   center: coords,        // e.g. [77.5946, 12.9716]
//   zoom: 10
// });
// // …marker code…



// new maptilersdk.Marker()
//     .setLngLat(campground.geometry.coordinates)
//     .setPopup(
//         new maptilersdk.Popup({ offset: 25 })
//             .setHTML(
//                 `<h3>${campground.title}</h3><p>${campground.location}</p>`
//             )
//     )
//     .addTo(map)



// public/javascripts/showMap.js
const markerIcon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Leaflet_marker_icon.png/800px-Leaflet_marker_icon.png',  // Replace with your custom marker image URL
  iconSize: [32, 32],  // Size of the icon
  iconAnchor: [16, 32], // Position of the icon anchor (tip of the marker)
  popupAnchor: [0, -32] // Position of the popup relative to the icon
});

document.addEventListener("DOMContentLoaded", function() {
  console.log("Campground Geometry:", campground.geometry);
  if (campground.geometry && Array.isArray(campground.geometry.coordinates) && campground.geometry.coordinates.length === 2) {
    const coordinates = [...campground.geometry.coordinates]; // [lng, lat]
    const latlng = [coordinates[1], coordinates[0]]; // convert to [lat, lng]

    const map = L.map("map").setView(latlng, 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker(latlng, { icon: markerIcon })
    .addTo(map)
    .bindPopup(`<h3>${campground.title}</h3><p>${campground.location}</p>`)
    .openPopup();
} else {
    console.error("Invalid campground coordinates:", campground.geometry.coordinates);
  }
});
