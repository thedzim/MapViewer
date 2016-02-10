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
    // Add control for displaying mouse position coordinates
    L.control.mousePosition().addTo(map);
    // Handle the event where the user has drawn a feature. Add this to the currently selected annotation layer.
    map.on('draw:created', self.onFeatureDrawn);
    // Add the swipe control
    map.addControl(rgi.swipeControl);
    var zoomControl = new L.control.zoom({ position: 'topleft' });
    map.addControl(zoomControl);
    map.on('overlayadd', layerAdded);
    map.on('overlayremove', layerRemoved);

    // Return the map
    return map;
};