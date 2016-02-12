
var $ = jQuery;

var instantiateMap = function(){
    var map = L.map('map', {
        zoomControl: false, // Zoom control will be added further down in this function to allow for the proper ordering of controls
        attributionControl: false,
    }).setView([0, 0], 3);

    var baseMaps = {};
    var openStreetWgs84 = new L.TileLayer.WMS("http://ows.terrestris.de/osm/service", {
        layers: "OSM-WMS",
        format: "image/png",
        transparent: true,
        noWrap: true
    }).addTo(map);
    
    baseMaps["Terrestris Streets"] = openStreetWgs84;
    // Add a scale control
    L.control.scale({ position: 'bottomleft' }).addTo(map);
    var zoomControl = new L.control.zoom({ position: 'topleft' });
    map.addControl(zoomControl);
    // Return the map
    return map;
};

$(document).ready(function(){
    instantiateMap();
    var socket = io.connect('http://localhost');
    socket.on('news', function(data) {
        console.log(data);
    });
});