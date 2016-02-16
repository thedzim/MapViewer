var $ = jQuery;

function MasterViewModel() {
    var self = this;
    self.workers = ko.observableArray();
    var socket = io('/master');
    // socket.emit('masterConnection', "master connected");
    socket.on('workerConnections', function(data) {
       self.updateWorkers(data);
    });
    socket.on("workerDisconnected", function(data) {
    	self.updateWorkers(data);
    });

   	MasterViewModel.prototype.updateWorkers = function(workerList) {
   		$.each(workerList, function(index, workerObject) {
        	self.workers.push(workerObject);
        });
   	};
	return self;
};

$(document).ready(function(){
    ko.applyBindings(new MasterViewModel);
});