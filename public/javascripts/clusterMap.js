// 1. Create the map centered on the world (adjust later)
const map = L.map('cluster-map').setView([20, 0], 2);

// 2. Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// 3. Create a marker cluster group
const markers = L.markerClusterGroup();

// 4. Loop through campgrounds and add to cluster group
campgrounds.forEach(camp => {
    if (!camp.geometry) return;

    const marker = L.marker([
        camp.geometry.coordinates[1], // latitude
        camp.geometry.coordinates[0]  // longitude
    ]);

    marker.on('click', () => {
        window.location.href = `/campgrounds/${camp._id}`;
    });

    markers.addLayer(marker);
});

// 5. Add marker cluster group to the map
map.addLayer(markers);
