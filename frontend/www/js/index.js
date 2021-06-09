
var socket;
var localUsername;
var fieldTable;
var gameStatusMistakeSpan;
var gameStatusTimeSpan;

var currentField;
var currentActions;
var currentFieldSize;

var currentRoomId;
var currentGameStartTime = -1;
var currentGameStopTime = -1;
var currentGameFinished = false;

// Wait for the deviceready event before using any of Cordova's device APIs.
document.addEventListener('deviceready', onDeviceReady, false);

/* ----------------------------- */
/* ------ INITIALIZATION ------- */
/* ----------------------------- */
function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    // console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    // get local username
    if (localStorage.username === undefined) {
        localUsername = prompt('Your username:');
        localStorage.username = localUsername;
    } else {
        localUsername = localStorage.username;
    }


    // try to connect to websocket server
    // socket = new WebSocket('ws://fischly.freemyip.com:7777/ws');
    socket = io.connect('ws://fischly.freemyip.com:7778');
    // socket = io('ws://localhost:8080');

    socket.on('connect', onSocketOpen);
    socket.on('disconnect', onSocketClose);
    socket.on('message', onSocketMessage);
    socket.on('error', onSocketError);

    // add event listener to the buttons
    $('#btn-join-room').click(onRoomJoinButtonClick);
    $('#btn-create-room').click(onRoomCreateButtonClick);

    $('#room-btn-start').click(onRoomStartButtonClick);

    // add listeners to the tbody
    $('.app table tbody').mousemove(onTableMouseMove);
    $('.app table tbody').mousedown(onTableMouseDown);
    $('.app table tbody').mouseup(onTableMouseUp);


    fieldTable = document.querySelector('.app table tbody');

    gameStatusMistakeSpan = document.querySelector('#game-status-mistakes-value');
    gameStatusTimeSpan = document.querySelector('#game-status-timer-value');

    /* DEBUGGING LOADING A FIELD */
    /*
    // generate field and render it as table
    const fieldSize = {width: 10, height: 10};
    currentField = seed2field(Math.random(), fieldSize);
    renderField(fieldTable, currentField.field, currentField.hintsX, currentField.hintsY, fieldSize);
    currentFieldSize = fieldSize;

    // $(fieldTable.parentElement).tooltip('show');
    console.log($().tooltip);
     // create the actions array
    currentActions = [];
    for (let y = 0; y < currentFieldSize.height; y++) {
        currentActions[y] = [];
        for (let x = 0; x < currentFieldSize.width; x++) {
            currentActions[y][x] = 0;
        }
    }*/
    /* DEBUGGING LOADING A FIELD END */


    // Array.from({length: 25}, () => Math.floor(Math.random() * 50)).forEach(i => $('.cell').get(i).classList.add('opened'));
    // Array.from({length: 25}, () => Math.floor(Math.random() * 50)).forEach(i => $('.cell').get(i).classList.add('mistake'))
    // Array.from({length: 25}, () => Math.floor(Math.random() * 50)).forEach(i => $('.cell').get(i).classList.add('mistakeother'))
    // Array.from({length: 25}, () => Math.floor(Math.random() * 50)).forEach(i => $('.cell').get(i).classList.add('correctother'))
}

/* ----------------------------- */
/* -------- NETWORKING --------- */
/* ----------------------------- */
function onSocketOpen(event) {
    // change status message and enable starting button
    $('#connection-status-changeable').text('Connected!');
    $('#connection-status-changeable').removeClass('loading');
    $('#connection-status-changeable').removeClass('error');
    $('#connection-status-changeable').addClass('success');

    $('#btn-join-room').removeClass('disabled');
    $('#btn-create-room').removeClass('disabled');

    // sending RegisterUser message
    console.info('Sending RegisterUser message with user id = ', localUsername);
    socket.send(JSON.stringify({ type: 'RegisterUser', userId: localUsername }));
}

function onSocketClose(event) {
    alert(event.code);
    alert(window.navigator.onLine)
}

function onSocketError(event) {
    // change status message and enable starting button
    $('#connection-status-changeable').text('Error!');
    $('#connection-status-changeable').removeClass('loading');
    $('#connection-status-changeable').removeClass('success');
    $('#connection-status-changeable').addClass('error');
}

function onSocketMessage(event) {
    const message = JSON.parse(event);

    console.log('GOT MESSAGE: ', message);

    switch (message.type) {
        case 'RoomJoined': handleRoomJoinedMessage(message); break;
        case 'GameStarted': handleGameStartedMessage(message); break;
        case 'ActionPerformed': handleActionPerformedMessage(message); break;
        case 'PlayerDone': handlePlayerDoneMessage(message); break;
        default: console.log('GOT UNHANDELED MESSAGE: ', message); break;
    }
}

/* ----------------------------- */
/* ------- BUTTON INPUT -------- */
/* ----------------------------- */
function onRoomCreateButtonClick(event) {
    const messageToSend = { type: 'CreateRoom', userId: localUsername };

    console.info('Sending a CreateRoom message: ', messageToSend);
    socket.send(JSON.stringify(messageToSend));
}
function onRoomJoinButtonClick(event) {
    const roomId = $('#realtime-roomid').val();

    if (!roomId) {
        alert('You have to input a room id!');
        return;
    }

    const messageToSend = { type: 'JoinRoom', userId: localUsername, roomId: roomId };
    console.info('Sending a JoinRoom message: ', messageToSend);
    socket.send(JSON.stringify(messageToSend));
}
function onRoomStartButtonClick(event) {
    const roomId = $('#room-roomid').val();

    const messageToSend = { type: 'StartGame', userId: localUsername, roomId: roomId };
    console.info('Sending a JoinRoom message: ', messageToSend);
    socket.send(JSON.stringify(messageToSend));
    
}


/* ----------------------------- */
/* -------- TOUCH INPUT -------- */
/* ----------------------------- */
function onTouchStart(event) {
    console.log('[onTouchStart]', event);

}

function onTouchEnd(event) {
    console.log('[onTouchEnd]', event);
}



/* ----------------------------- */
/* ----- MESSAGE HANDLING ------ */
/* ----------------------------- */
function handleRoomJoinedMessage(message) {
    let userId = message.userId;
    let roomId = message.roomId;
    let seed = message.seed;
    let others = message.others;

    if (userId === localUsername) {
        $('#room-username').val(userId);
        $('#room-roomid').val(roomId);
        $('#room-seed').val(seed);
        $('#room-others').val(others.join('\n'));

        $('.screen-title').addClass('d-none');
        $('.screen-realtime').removeClass('d-none');

        currentRoomId = roomId;
    } else {
        // update others
        $('#room-others').val(others.join('\n'));
    }
}

function handleGameStartedMessage(message) {
    const roomId = message.roomId;
    const seed = message.seed;
    const others = message.others;
    const fieldSize = message.fieldSize;

    $('.screen-realtime').addClass('d-none');
    $('.app').removeClass('d-none');

    currentRoomId = roomId;

    // generate field and render it as table
    currentField = seed2field(seed, fieldSize);
    renderField(fieldTable, currentField.field, currentField.hintsX, currentField.hintsY, fieldSize);
    currentFieldSize = fieldSize;
    
    // create the actions array
    currentActions = [];
    for (let y = 0; y < currentFieldSize.height; y++) {
        currentActions[y] = [];
        for (let x = 0; x < currentFieldSize.width; x++) {
            currentActions[y][x] = 0;
        }
    }

    // set the game started time
    currentGameStartTime = Date.now();
    currentGameFinished = false;

    // start a update "thread"
    const timerFunc = () => {
        if (!currentGameFinished) {
            gameStatusTimeSpan.innerText = (((Date.now() - currentGameStartTime) / 1000) | 0);
            window.setTimeout(timerFunc, 1000);
        }
    };
    window.setTimeout(timerFunc, 1000);

    // let intervalId = window.setInterval(() => {
    //     gameStatusTimeSpan.innerText = (((Date.now() - currentGameStartTime) / 1000) | 0);

    //     if (currentGameFinished) {
    //         window.clearInterval(intervalId);
    //     }
    // }, 1000);
}

function handleActionPerformedMessage(message) {
    let userId = message.userId;
    let fieldState = message.fieldState;

    // update other field state
    updateFieldOnOtherActionPerformed(fieldState);
}

function handlePlayerDoneMessage(message) {
    const userId = message.userId;
    const time = message.time;
    const mistakes = message.mistakes;

    $('#game-status-alert').text(`Other player finished in ${((time / 1000) | 0)}s and with ${mistakes} errors.`);
    $('#game-status-alert').fadeIn();
}

/* for local debugging: TODO REMOVE!!! */
onDeviceReady();