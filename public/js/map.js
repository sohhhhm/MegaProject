mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  style :"mapbox://styles/mapbox/dark-v11",
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

console.log(listing.geometry.coordinates);

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`
    )
  )
  .addTo(map);
