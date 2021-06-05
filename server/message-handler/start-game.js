const roomHandler = require('../data-handler/game-rooms');
const userHandler = require('../data-handler/users');


exports.handleStartGameMessage =  function(message) {
    let userId = message.userId;
    let roomId = message.roomId;

    console.log(`[StartGame] got StartGame message (userId = ${userId}, roomId = ${roomId})`);

     // test if this room exists
     if (roomHandler.gameRooms[roomId] === undefined) {
        // send error message
        userHandler.userList[userId].send(JSON.stringify({ type: 'error', text: 'this room does not exist'}));
        console.info('[JoinRoom] a user tried to join room ' + roomId + ', but this room does not exist.');
        return;
    }

    const room = roomHandler.gameRooms[roomId];

    if (room.started) {
        userHandler.userList[userId].send(JSON.stringify({ type: 'error', text: 'this game was already started'}));
        console.info('[JoinRoom] a user tried to join room ' + roomId + ', but this room was already started.');
        return;
    }

    room.started = true;

    const gameStartedMessage = { type: 'GameStarted', roomId: roomId, seed: room.seed, others: room.users, fieldSize: room.fieldSize };

    // send a GameStarted message to everyone in the room
    for (let user of room.users) {
        console.log('sending GameStarted message (', gameStartedMessage, ') to user from userlist: ', user);
        userHandler.userList[user].send(JSON.stringify(gameStartedMessage));
    }  
}