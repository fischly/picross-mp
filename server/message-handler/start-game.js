
exports.handleStartGameMessage =  function(message) {
    let userId = message.userId;
    let roomId = message.roomId; // needed?

    console.log(`[StartGame] got StartGame message (userId = ${userId}, roomId = ${roomId})`);

    
}