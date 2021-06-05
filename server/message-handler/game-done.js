
const roomHandler = require('../data-handler/game-rooms');
const userHandler = require('../data-handler/users');

const logging = require('../util/logging');

exports.handleGameDoneMessage = function(message) {
    const userId = message.userId;
    const roomId = message.roomId;
    const time = message.time;
    const mistakes = message.mistakes;

    console.log(`[GameDone] got GameDone message (userId = ${userId}, roomId = ${roomId}, time = ${time}, mistakes = ${mistakes})`);

     // test if this room exists
     if (roomHandler.gameRooms[roomId] === undefined) {
        // send error message
        userHandler.userList[userId].send(JSON.stringify({ type: 'error', text: 'this room does not exist'}));
        console.info('[ActionPerformed] a user tried to send ActionPerformed message to room ' + roomId + ', but this room does not exist.');
        return;
    }

    const room = roomHandler.gameRooms[roomId];
    
    const playerDoneMessage = { type: 'PlayerDone', userId: userId, time: time, mistakes: mistakes };
    for (let user of room.users) {
        if (user != userId) { 
            console.log('[PlayerDone] sending PlayerDone message (', playerDoneMessage, ') to user from userlist: ', user);
            userHandler.userList[user].send(JSON.stringify(playerDoneMessage));
        }
    }

    logging.log_win(userId, time, mistakes);
}