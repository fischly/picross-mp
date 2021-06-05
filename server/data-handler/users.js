
// a list that contains tuples to get a socketclient by giving a username
// the tuples are in the form { userName, socketclient }
userList = [];

findUserBySocket = function(ws) {
    for (let user in userList) {
        if (userList[user] == ws) {
            return user;
        }
    }
}

module.exports = {
    userList: userList,
    findUserBySocket: findUserBySocket
};