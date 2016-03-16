var MapController = new function(){
	var self = this;
	
	self.initializeMap = function(wmsURL) {
	    var map = L.map('map', {
	        zoomControl: false, // Zoom control will be added further down in this function to allow for the proper ordering of controls
	        attributionControl: false,
	    }).setView([0,0], 3);

	    var tileLayer = new L.TileLayer.WMS(wmsURL, {
	        layers: "OSM-WMS",
	        format: "image/png",
	        transparent: true,
	        noWrap: true,
	        tms: false
	    }).addTo(map);

	    self.collectMetrics(tileLayer);
	    
	    // Add a scale control
	    L.control.scale({ position: 'bottomleft' }).addTo(map);
	    var zoomControl = new L.control.zoom({ position: 'topleft' });
	    map.addControl(zoomControl);
	    
	    // Return the map
	    return map;
	};

	self.getCapabilities = function(url){
		var capabilities;
		return capabilities;
	}

	self.addDrawControls = function(map) {
		var drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);
		var drawControl = new L.Control.Draw({
			position: 'topright',
			draw: {
				polygon: false,
				polyline: false,
				circle: false,
				marker: false,
			},
			edit: {
				featureGroup: drawnItems
			}
		});
		map.addControl(drawControl);

		map.on('draw:created', function (e) {
			drawnItems.addLayer(e.layer);
			return e.layer;
		});
	}

	self.drawBBOX = function(map, data){
		var bounds = [data[0], data[1]];
		// create an orange rectangle
		L.rectangle(bounds).addTo(map);
		// zoom the map to the rectangle bounds
		map.fitBounds(bounds);
	}

	self.collectMetrics = function(tileLayer){
		var timer = function(){
			return Date.now();
		}
		var start, stop, diff;
		tileLayer.on("loading", function(){
			start = timer();
			console.log("loading started...")
		});
	    tileLayer.on("load", function(){ 
	    	stop = timer();
	    	diff = stop - start
	    	console.log("everything loaded in: " + diff + "ms");
	    	socket.emit("metrics", diff);
	    });
	}

	self.getRandomInRange = function(from, to, fixed) {
	    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
	    // .toFixed() returns string, so ' * 1' is a trick to convert to number
	}

	self.operateMap = function(workermap, bounds) {
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
	            if(bounds != undefined){
	            	// bounds is [[lat,lng], [lat, lng]]
	            	// 0,0 is lower lat 1,0 is up upper lat
	            	lat = self.getRandomInRange(bounds[0][0], bounds[1][0], fixed);
	            	// 0,1 is lower lng, 1,1 is upper lng
	            	lng = self.getRandomInRange(bounds[0][1], bounds[1][1], fixed);
	            }else{
	            	lat = self.getRandomInRange(lat -2.5, lat + 2.5, fixed);
	           		lng = self.getRandomInRange(lng -2.5, lng + 2.5, fixed);
	            }
	            
	            // new zoom level within the levels of 5 and 8 for easier ability to read the map
	            zoom = Math.abs(self.getRandomInRange(5, 8, 0));
	            map.setView({lat: lat, lon: lng}, zoom, options)
	        }, 4000);
	    };

	    setNewView();
	};

} 