var $ = jQuery;

function MasterViewModel() {
    var self = this;
    self.workers = ko.observableArray();
    var socket = io('/master');
    // socket.emit('masterConnection', "master connected");
    socket.on('workerConnections', function(data) {
        $.each(data, function(index, workerObject) {
        	self.workers.push(workerObject);
        });
        console.log(data);
    });
    socket.on("workerDisconnected", function(data) {
    	
    }
	return self;
};

$(document).ready(function(){
    ko.applyBindings(new MasterViewModel);
});