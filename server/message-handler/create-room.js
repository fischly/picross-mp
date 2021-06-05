const roomHandler = require('../data-handler/game-rooms');
const userHandler = require('../data-handler/users');
const uuid = require('../util/uuid').uuidv4;

exports.handleCreateRoomMessage = function(message) {
    let userId = message.userId;
    let seed = (message.seed === undefined) ? Date.now() : message.seed;
    let fieldSize = (message.fieldSize === undefined) ? { width: 10, height: 10 } : message.fieldSize;

    console.log(`[CreateRoom] got CreateRoom message (userId = ${userId}, seed = ${seed}, fieldSize = ${fieldSize})`);

    // generate room id
    let roomId = uuid();
    console.log('generated room id = ', roomId);

    // add room to the room list
    roomHandler.gameRooms[roomId] = {
        users: [userId],
        seed: seed,
        started: false,
        fieldSize: fieldSize
    };

    console.log(userHandler.userList);

    // answering with an RoomJoined message
    const roomJoinedMessage = { type: 'RoomJoined', userId: userId, roomId: roomId, seed: seed, others: [userId], fieldSize: fieldSize };
    console.log('sending RoomJoined message (', roomJoinedMessage, ') to user from userlist: ', userId);
    userHandler.userList[userId].send(JSON.stringify(roomJoinedMessage));
}
