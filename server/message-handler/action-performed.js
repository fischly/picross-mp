
const roomHandler = require('../data-handler/game-rooms');
const userHandler = require('../data-handler/users');

exports.handleActionPerformedMessage = function(message) {
    const userId = message.userId;
    const roomId = message.roomId;
    const fieldState = message.fieldState;

    console.log(`[ActionPerformed] got ActionPerforme message (userId = ${userId}, fieldState = [...])`);

     // test if this room exists
     if (roomHandler.gameRooms[roomId] === undefined) {
        // send error message
        userHandler.userList[userId].send(JSON.stringify({ type: 'error', text: 'this room does not exist'}));
        console.info('[ActionPerformed] a user tried to send ActionPerformed message to room ' + roomId + ', but this room does not exist.');
        return;
    }

    const room = roomHandler.gameRooms[roomId];
    
    const actionPerformedMessage = { type: 'ActionPerformed', userId: userId, fieldState: fieldState };
    for (let user of room.users) {
        if (user != userId) { 
            console.log('[ActionPerformed] sending ActionPerformed message to user from userlist: ', user);
            userHandler.userList[user].send(JSON.stringify(actionPerformedMessage));
        }
    }
}