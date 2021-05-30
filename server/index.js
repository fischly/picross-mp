const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const fs = require('fs');

// create the HTTP server that is used to serve the index.html as well as for connecting to the websocket server
const server = http.createServer();

// create the websocket server, using noServer = true, since we want to connect over the http server
const wss = new WebSocket.Server({ noServer: true });

// handle incoming websocket connections
wss.on('connection', function connection(ws) {
    console.log('on connection: ');
    // handling websocket messages
    ws.on('message', function incoming(message) {
        let jsonMessage = JSON.parse(message);
        console.log('JSON message: ', jsonMessage);

        switch (jsonMessage.type) {
           /* TODO: handle different chat messages */
        }

        console.log('received: ', message);
    });

    ws.on('close', function closing(code, reason) {
        console.log('client disconnected, code = ', code, ', reason = ', reason);
    });
});



/* helper functions */
function broadcast(message) {
    // stringify the JS object since WebSockets can only send strings
    let stringifiedMessage = JSON.stringify(message);
    // iterate over all clients, check if they are still connected and send the message to them
    wss.clients.forEach(function (client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(stringifiedMessage);
        }
    });
}



/* http server events */
// the upgrade event is called when a request wants to be upgradet to websocket
server.on('upgrade', function (request, socket, head) {
    console.log('server on upgrade. url = ', request.url);
    // get the pathname from the url
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/ws') {
        console.log('server on upgrade on path /ws, calling wss.handleUpgrade()');
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    } else {
        console.log('no matching pathname for "' + pathname + '", destroying socket');
        socket.destroy();
    }
});

// the request event is called when there is a "normal" http request
server.on('request', function (request, response) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            response.writeHead(404);
            response.end(JSON.stringify(err));
            return;
        }
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
    });
});

// start the server on port 8080
server.listen(8080);