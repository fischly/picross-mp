
const userHandler = require('../data-handler/users');

exports.handleRegisterUserMessage = function(message, ws) {
    let userId = message.userId;

    console.log(`[RegisterUser] got RegisterUser message (userId = ${userId})`);
    console.log('adding user to userlist...');
    
    userHandler.userList[userId] = ws;
}