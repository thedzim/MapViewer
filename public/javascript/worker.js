var $ = jQuery;

function WorkerViewModel() {
    var self = this;
    self.map = self.initializeMap();
    self.map.setView({lat: 38, lon: -77}, 7);
};

WorkerViewModel.prototype.initializeMap = function(){
    var map = L.map('map', {
        zoomControl: false, // Zoom control will be added further down in this function to allow for the proper ordering of controls
        attributionControl: false,
    }).setView([0, 0], 3);

    var baseMaps = {};
    var openStreetWgs84 = new L.TileLayer.WMS("http://ows.terrestris.de/osm/service", {
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

WorkerViewModel.prototype.operateMap = function(){
    // initialize some variables
    var self = this;
    var map = self.map;
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
        setInterval(function(){
            // generate two new latlng values within +/- 2.5 degrees of the current coords
            lat = getRandomInRange(lat -2.5, lat + 2.5, fixed);
            lng = getRandomInRange(lng -2.5, lng + 2.5, fixed);
            // new zoom level within the levels of 5 and 8 for easier ability to read the map
            zoom = Math.abs(getRandomInRange(5, 8, 0));
            map.setView({lat: lat, lon: lng}, zoom, options)
        }, 4000);
    };
    for(var i = 0; i < 20; i++){
        setNewView();
    }
};

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}


$(document).ready(function(){
    var workerViewModel = new WorkerViewModel();
    var socket = io('/worker');
    socket.on('news', function(data) {
        console.log(data);
    });
    ko.applyBindings(workerViewModel);
});