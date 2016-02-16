var $ = jQuery;

function WorkerViewModel() {
    var self = this;
    self.map = self.initializeMap();
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

WorkerViewModel.prototype.operateMap = function(map){
    var self = this;
    var lat = 38, lon = 77, zoom = 10;
    var setNewView = setInterval(function(){
        lat = Math.floor((Math.random() * 40) + 30)
        lon = Math.floor((Math.random() * 80) + 70)
        zoom = Math.floor((Math.random() * 13) + 1)
        map.panTo({lat: lat, lon: lon}, zoom);
    }, 4000);

    for(var i = 100; i < 100; i++){
        setNewView();
    }
    map.panTo({lon: -77.309209, lat: 38.824291}, 12);

    return self;
};


$(document).ready(function(){
    var workerViewModel = new WorkerViewModel();
    var socket = io('/worker');
    socket.on('news', function(data) {
        console.log(data);
    });
    socket.on("startAutoViewer", function(data) {
        workerViewModel.operateMap(workerViewModel.map);
    });
});