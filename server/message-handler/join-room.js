const roomHandler = require('../data-handler/game-rooms');
const userHandler = require('../data-handler/users');


exports.handleJoinRoomMessage = function(message) {
    let userId = message.userId;
    let roomId = message.roomId;

    console.log(`[JoinRoom] got JoinRoom message (userId = ${userId}, roomId = ${roomId})`);

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

    // update the room
    room.users.push(userId);

    // answering with an RoomJoined message
    const roomJoinedMessage = { type: 'RoomJoined', userId: userId, roomId: roomId, seed: room.seed, others: room.users, fieldSize: room.fieldSize };

    // send to every user in the room
    for (let user of room.users) {
        console.log('sending RoomJoined message (', roomJoinedMessage, ') to user from userlist: ', user);
        userHandler.userList[user].send(JSON.stringify(roomJoinedMessage));
    }  
}