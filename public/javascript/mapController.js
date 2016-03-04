var MapController = new function(){
	var self = this;
	var bounds;
	var southWest;
	var northEast; 
	var bbox;
	
	self.initializeMap = function() {
	    var map = L.map('map', {
	        zoomControl: false, // Zoom control will be added further down in this function to allow for the proper ordering of controls
	        attributionControl: false,
	    }).setView([0,0], 3);

	    var tileLayer = new L.TileLayer.WMS("http://ows.terrestris.de/osm/service", {
	        layers: "OSM-WMS",
	        format: "image/png",
	        transparent: true,
	        noWrap: true,
	        tms: false
	    }).addTo(map);

	    tileLayer.on("load", function(){ console.log("everything is loaded")});
	    
	    // Add a scale control
	    L.control.scale({ position: 'bottomleft' }).addTo(map);
	    var zoomControl = new L.control.zoom({ position: 'topleft' });
	    map.addControl(zoomControl);
	    
	    // Return the map
	    return map;
	};

	self.addDrawControls = function(map) {
		var drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);
		var drawControl = new L.Control.Draw({
			position: 'topright',
			draw: {
				polygon: {
					shapeOptions: {
						color: 'purple'
					},
					allowIntersection: false,
					drawError: {
						color: 'orange',
						timeout: 1000
					},
					showArea: true,
					metric: false,
					repeatMode: true
				},
				rect: {
					shapeOptions: {
						color: 'green'
					},
				},
				circle: {
					shapeOptions: {
						color: 'steelblue'
					},
				},
			},
			edit: {
				featureGroup: drawnItems
			}
		});
		map.addControl(drawControl);

		map.on('draw:created', function (e) {
			var type = e.layerType,
				layer = e.layer;
			drawnItems.addLayer(layer);
			self.bounds = layer.getBounds();
			self.southWest = [self.bounds._southWest.lat.toFixed(3) * 1, self.bounds._southWest.lng.toFixed(3) * 1];
			self.northEast = [self.bounds._northEast.lat.toFixed(3) * 1, self.bounds._northEast.lng.toFixed(3) * 1];
			self.bbox = [self.bounds._southWest.lat.toFixed(3) * 1, self.bounds._northEast.lng.toFixed(3) * 1]
			return layer;
		});
	}

	self.drawBBOX = function(){
		
	}
	self.getRandomInRange = function(from, to, fixed) {
	    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
	    // .toFixed() returns string, so ' * 1' is a trick to convert to number
	}

	self.operateMap = function(workermap) {
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
	            lat = self.getRandomInRange(lat -2.5, lat + 2.5, fixed);
	            lng = self.getRandomInRange(lng -2.5, lng + 2.5, fixed);
	            // new zoom level within the levels of 5 and 8 for easier ability to read the map
	            zoom = Math.abs(self.getRandomInRange(5, 8, 0));
	            map.setView({lat: lat, lon: lng}, zoom, options)
	        }, 4000);
	    };

	    setNewView();
	};

} 