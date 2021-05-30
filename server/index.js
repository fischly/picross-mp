const express = require('express');
const http = require('http');
const url = require('url');
const fs = require('fs');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' }});

// serve the index.html file on the / route http server
app.get('/', (req, resp) => {
    resp.sendFile(__dirname + '/index.html');
});

// import all the message handlers
const handleActionPerformedMessage = require('./message-handler/action-performed').handleActionPerformedMessage;
const handleCreateRoomMessage = require('./message-handler/create-room').handleCreateRoomMessage;
const handleJoinRoomMessage = require('./message-handler/join-room').handleJoinRoomMessage;
const handleRegisterUserMessage = require('./message-handler/register-user').handleRegisterUserMessage;
const handleStartGameMessage = require('./message-handler/start-game').handleStartGameMessage;

// handle incoming socket.io connections
io.on('connection', function(ws) {
    console.log('on connection: ');
    // handling websocket messages
    ws.on('message', function(message) {
        const jsonMessage = JSON.parse(message);
        console.log('JSON message: ', jsonMessage);

        switch (jsonMessage.type) {
            case 'CreateRoom': handleCreateRoomMessage(jsonMessage); break;
            case 'StartGame': handleStartGameMessage(jsonMessage); break;
            case 'RegisterUser': handleRegisterUserMessage(jsonMessage, ws); break;
            case 'JoinRoom': handleJoinRoomMessage(jsonMessage); break;
            case 'ActionPerformed': handleActionPerformedMessage(jsonMessage); break;
         }
 
         console.log('received: ', message);
    });

    ws.on('disconnect', function(code, reason) {
        console.log('client disconnected, code = ', code, ', reason = ', reason);
    });
});

// start the server on port 8080
server.listen(8080, function() {
    console.log(`Server running on port 8080`);
});