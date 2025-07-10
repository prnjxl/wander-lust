mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 10 // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: 'red'}) //styling to pointer
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset : 25}).setHTML(  //popup on clicking the mapmarker
    `<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`
))
.addTo(map); 

//homework add icon as marker