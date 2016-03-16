# MapViewer
1. Install node.js version 5.5.0
2. Place unzipped MapViewer folder into directory of your choice. Copy the address for the file 'server.js' within the MapViewer directory
3. Navigate in command line to node directory
4. type node [file path to server.js]
5. You should see a console message that says "Server Running at localhost:8081"
6. Instruct clients to navigate in their browser (firefox, chrome recommended) to the IP address of the machine that is running the node server at port :8081
7. Whomever is going to be controlling the test, should navigate their browser to [IPAddress:8081/master]
8. The master should click on the Map tab, and draw a boundingbox on the OPENSTREET map that is provided. This will limit the auto viewer to scroll only
	within the bounding box you draw
9. Click start
10. All metrics will show up in the Stats tab, all connections to the server will show up in the Connections tab
11. IF ANY CONNECTION IS MADE AFTER THE TEST HAS BEEN STARTED THERE IS NO CURRENT WAY TO START THAT INDIVIDUAL MACHINE. BE SURE THAT ALL CONNECTIONS ARE 
	MADE BEFORE STARTING TEST, OTHERWISE TEST MUST BE STARTED AGAIN BY REFRESHING EACH PAGE (MASTER AND ALL CLIENTS)
