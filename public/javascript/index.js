
var socket = io('/worker');
var autoViewer;
var map;
socket.on('news', function (data) {
	console.log(data);
});
socket.on('start', function(data){
    console.log(data);
    wmsURL = data.url;
    bbox = data.bbox;
	map = initializeMap(wmsURL);
	toggleMessage();
	setTimeout(function(){
		$("#testingGIF").hide()
	}, 3000);
	operateMap(map);
    socket.emit("running", "running");
});
socket.on("stop", function(data){
    console.log(autoViewer);
    clearInterval(autoViewer);
    map = undefined;
    socket.emit("stopped", "stopped");
    toggleMessage();
});

function toggleMessage() {
    $("#waitingMessage").toggle();
    $("#testingMessage").toggle();
}

function initializeMap(wmsURL) {
    var map = L.map('map', {
        zoomControl: false, // Zoom control will be added further down in this function to allow for the proper ordering of controls
        attributionControl: false,
    }).setView([0, 0], 3);

    var url = wmsURL ? wmsURL : "http://ows.terrestris.de/osm/service"
    var baseMaps = {};
    var openStreetWgs84 = new L.TileLayer.WMS(wmsURL, {
        layers: "OSM-WMS",
        format: "image/png",
        transparent: true,
        noWrap: true,
        tms: false
    }).addTo(map);
    
    baseMaps["Terrestris Streets"] = openStreetWgs84;
    // Add a scale control
    L.control.scale({ position: 'bottomleft' }).addTo(map);
    var zoomControl = new L.control.zoom({ position: 'topleft' });
    map.addControl(zoomControl);
    // Return the map
    return map;
};

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

function operateMap(workermap) {
    // initialize some variables
    var self = this;
    var map = workermap;
    var fixed = 5;
    var latlng = map.getCenter();
    var lat = latlng.lat, lng = latlng.lng;
    var zoom = map.getZoom();
    var options = {
            reset: false,
            pan: {
                duration: 1, 
                easeLinearity: .1
            },
            animate: true
        };
    function setNewView() {
        autoViewer = setInterval(function(){
            // generate two new latlng values within +/- 2.5 degrees of the current coords
            lat = getRandomInRange(lat -2.5, lat + 2.5, fixed);
            lng = getRandomInRange(lng -2.5, lng + 2.5, fixed);
            // new zoom level within the levels of 5 and 8 for easier ability to read the map
            zoom = Math.abs(getRandomInRange(5, 8, 0));
            map.setView({lat: lat, lon: lng}, zoom, options)
        }, 4000);
    };

    setNewView();
};
