
mapboxgl.accessToken = maptoken;
console.log(maptoken);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const marker= new mapboxgl.Marker({color: 'Red'})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25}).setHTML(
            `<h4>${listing.location}</h4>`
        )
    )
    .addTo(map)