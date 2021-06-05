const fs = require('fs');

function log_win(userId, timeTaken, mistakes) {
    const d = new Date();
    const logMessage = `[${d.getDate()}.${d.getMonth()}.${d.getFullYear()}] ${userId} took ${timeTaken} with ${mistakes} mistakes`;

    fs.writeFile('wins.txt', logMessage, { flag: 'a+' }, (err) => {
        if (err) {
            console.err('Error while writing win log: ', err);
        }
        console.log('Writting log: ', logMessage);
    });
}


module.exports = {
    log_win: log_win
}