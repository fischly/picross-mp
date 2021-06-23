const express = require('express');
const http = require('http');
const url = require('url');
const fs = require('fs');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' }});

const userHandler = require('./data-handler/users');
const roomHandler = require('./data-handler/game-rooms');

// import all the message handlers
const handleActionPerformedMessage = require('./message-handler/action-performed').handleActionPerformedMessage;
const handleCreateRoomMessage = require('./message-handler/create-room').handleCreateRoomMessage;
const handleJoinRoomMessage = require('./message-handler/join-room').handleJoinRoomMessage;
const handleRegisterUserMessage = require('./message-handler/register-user').handleRegisterUserMessage;
const handleStartGameMessage = require('./message-handler/start-game').handleStartGameMessage;
const handleGameDoneMessage =  require('./message-handler/game-done').handleGameDoneMessage;

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
            case 'GameDone': handleGameDoneMessage(jsonMessage); break;
         }
 
         console.log('received: ', message);
    });

    ws.on('disconnect', function(code, reason) {
        console.log('client disconnected, code = ', code, ', reason = ', reason);
        
        // // remove user from userList
        // const removedUserId = userHandler.findUserBySocket(ws);
        // delete userHandler.userList[removedUserId];

        // // remove user from all rooms
    });
});


app.use(function(req, res, next) {
    if (req.path === '/') {
        return res.redirect('index.html');
    }
    next();
});
app.use(express.static('../frontend/www/'));

// start the server on port 8080
const port = Number.parseInt(process.argv[2]);
if (!port) {
    console.error('could not parse given port, aborting...');
    return;
}

server.listen(port, function() {
    console.log(`Server running on port ${port}`);
});
