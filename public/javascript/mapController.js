var MapController = new function(){
	var self = this;
	self.map;
	self.tileLayer;
	
	self.initializeMap = function(wmsURL, layerType) {
	    self.map = new L.map('map', {
	        zoomControl: false, // Zoom control will be added further down in this function to allow for the proper ordering of controls
	        attributionControl: false,
	    }).setView([0,0], 3);

	    if(layerType == undefined){
	    	layerType = "OSM-WMS";
	    }

	    var tileLayer = new L.TileLayer.WMS(wmsURL, {
	        layers: layerType.join(),
	        format: "image/png",
	        transparent: true,
	        noWrap: true,
	        tms: false
	    }).addTo(self.map);
	    self.tileLayer = tileLayer;
	    self.drawnItems = new L.FeatureGroup();
	    self.map.addLayer(self.drawnItems);
	    self.collectMetrics(tileLayer);
	    
	    // Add a scale control
	    L.control.scale({ position: 'bottomleft' }).addTo(self.map);
	    var zoomControl = new L.control.zoom({ position: 'topleft' });
	    self.map.addControl(zoomControl);
	    
	    // Return the map
	    return { 
	    	map: self.map, 
	    	tileLayer: tileLayer
	    };
	};

	self.prototype.getCapabilities = function(url, callback) {
		var self = this;
		if(url){
			// Query the server with the GetCapabilities request
			$.ajax({
				url: url + '/?service=WMS&request=GetCapabilities',
				type: "GET",
				dataType: "xml",
				cache: true,
				success: function(data) {
					var offeredLayers = [];
					if(data.hasChildNodes('Layers')){
						// namespaces breaks if they aren't included in ff, but break chrome if they are. the switch on browser type is so that it works
						if(window.chrome){
							supportedLayers = data.getElementsByTagName("Name");
						}else{
							supportedLayers = $(data).find("Name");
						}
					}
					if(callback != null){
						callback.success(supportedLayers, data);
					}
				},
				error: function(request, error, exception) {
					if (callback !== null) {
						callback.error(exception);
					}
				}
			});
		}
	};

	self.addDrawControls = function(map) {
		var drawControl = new L.Control.Draw({
			position: 'topright',
			draw: {
				polygon: false,
				polyline: false,
				circle: false,
				marker: false,
			},
			edit: {
				featureGroup: self.drawnItems
			}
		});
		map.addControl(drawControl);

		map.on('draw:created', function (e) {
			self.drawnItems.clearLayers();
			self.drawnItems.addLayer(e.layer);
			return e.layer;
		});
	}

	self.drawBBOX = function(map, data){
		var bounds = [data[0], data[1]];
		self.drawnItems.clearLayers();
		// create an orange rectangle
		self.drawnItems.addLayer(L.rectangle(bounds));
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
        newZoom = Math.abs(self.getRandomInRange(zoom -4, zoom + 5, 0));
        map.setView({lat: lat, lon: lng}, newZoom, options)
	};
};