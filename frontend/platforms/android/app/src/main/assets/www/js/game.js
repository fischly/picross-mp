
var tableMouseDownStart;
var tableIsMouseDown = false;

/* -------------------------- */
/* --- TABLE MOUSE EVENTS --- */
/* -------------------------- */
function onTableMouseMove(event) {
    // if the mouse was pressed down earlier...
    if (tableIsMouseDown) {
        // ...and if the mousemove event happened on a game cell
        if (event.target.dataset.x !== undefined && event.target.dataset.y !== undefined) {
            // add hovered class to all cells inbetween
            const cellX = Number.parseInt(event.target.dataset.x);
            const cellY = Number.parseInt(event.target.dataset.y);

            // clear all hovered classes
            $('.cell.hovered').removeClass('hovered');
            // mark the cell where the mouseDown event occured
            getCell(tableMouseDownStart.x, tableMouseDownStart.y).classList.add('hovered');
            if (cellX != tableMouseDownStart.x) {
                const hoverStart = Math.min(cellX, tableMouseDownStart.x);
                const hoverEnd = Math.max(cellX, tableMouseDownStart.x);

                for (let hoverCellX = hoverStart; hoverCellX <= hoverEnd; hoverCellX++) {
                    getCell(hoverCellX, tableMouseDownStart.y).classList.add('hovered');
                }
            } else if (cellY != tableMouseDownStart.y) {
                const hoverStart = Math.min(cellY, tableMouseDownStart.y);
                const hoverEnd = Math.max(cellY, tableMouseDownStart.y);

                for (let hoverCellY = hoverStart; hoverCellY <= hoverEnd; hoverCellY++) {
                    getCell(tableMouseDownStart.x, hoverCellY).classList.add('hovered');
                }
            }
        }
    }
}

function onTableMouseDown(event) {
    console.log('[MOUSEDOWN]', event);

    if (event.target.dataset.x !== undefined && event.target.dataset.y !== undefined) {
        const cellX = Number.parseInt(event.target.dataset.x);
        const cellY = Number.parseInt(event.target.dataset.y);

        console.log(`[MOUSEDOWN] on cell (${cellX}, ${cellY})`);

        tableMouseDownStart = { x: cellX, y: cellY };
        tableIsMouseDown = true;
    }
}

function onTableMouseUp(event) {
    console.log('[MOUSEUP]', event);

    if (tableIsMouseDown) {
        if (event.target.dataset.x !== undefined && event.target.dataset.y !== undefined) {
            const cellX = Number.parseInt(event.target.dataset.x);
            const cellY = Number.parseInt(event.target.dataset.y);

            // mouseDown cell == mouseUp cell, open the cell
            if (cellX == tableMouseDownStart.x && cellY == tableMouseDownStart.y) {
                openCell(cellX, cellY, event.which === 1);
            } else {
                if (cellX != tableMouseDownStart.x) {
                    const hoverStart = Math.min(cellX, tableMouseDownStart.x);
                    const hoverEnd = Math.max(cellX, tableMouseDownStart.x);

                    for (let hoverCellX = hoverStart; hoverCellX <= hoverEnd; hoverCellX++) {
                        openCell(hoverCellX, tableMouseDownStart.y, event.which === 1);
                    }
                } else if (cellY != tableMouseDownStart.y) {
                    const hoverStart = Math.min(cellY, tableMouseDownStart.y);
                    const hoverEnd = Math.max(cellY, tableMouseDownStart.y);

                    for (let hoverCellY = hoverStart; hoverCellY <= hoverEnd; hoverCellY++) {
                        openCell(tableMouseDownStart.x, hoverCellY, event.which === 1);
                    }
                }
            }

            // update mistake display
            const currentMistakes = getMistakeCount();
            gameStatusMistakeSpan.innerText = currentMistakes;


            // send ActionPerformed message
            if (socket && socket.connected) {
                const messageToSend = { type: 'ActionPerformed', userId: localUsername, fieldState: currentActions, roomId: currentRoomId };
                console.log('[ActionPerformed] Sending ActionPerformed message: ', messageToSend);
                socket.send(JSON.stringify(messageToSend));
            }

            // check if field is completed and send a GameDone message
            if (isFieldDone()) {
                currentGameFinished = true;
                currentGameStopTime = Date.now();

                const messageToSend = { type: 'GameDone', userId: localUsername, roomId: currentRoomId, time: currentGameStopTime - currentGameStartTime, mistakes: currentMistakes };
                console.log('[GameDone] Sending GameDone message: ', messageToSend);
                socket.send(JSON.stringify(messageToSend));

                // show the alert
                $('#game-status-alert-own-text').text(`Yay! You finished in ${((currentGameStopTime - currentGameStartTime) / 1000) | 0} seconds and only made ${currentMistakes} mistakes! I am proud of you.`);
                $('#game-status-alert-own').fadeIn();
            }
        }
    }

    // clear all hovered classes
    $('.cell.hovered').removeClass('hovered');
    tableIsMouseDown = false;
}
/* -------------------------- */
/* --- TABLE TOUCH EVENTS --- */
/* -------------------------- */
const modeButton = document.querySelector('#mode-switch-button');

var touchOpenMode = true;
var isTouchDown = false;
var isMultiTouch = false;

function onTouchStart(event) {
    console.log('[TOUCHSTART]', event);

    // if touch was not already down
    if (!isTouchDown) {
        let myev = { target: event.target, which: touchOpenMode ? 1 : 3 };
        onTableMouseDown(myev);

        isTouchDown = true;
    } else {
        isTouchDown = false;
        tableIsMouseDown = false;

        isMultiTouch = true;
    }

}

function onTouchEnd(event) {
    console.log('[TOUCHEND]', event);

    if (isTouchDown) {
        const realTarget = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        onTableMouseUp({ target: realTarget, which: touchOpenMode ? 1 : 3 });

        isTouchDown = false;
    }
    
    isMultiTouch = false;
}

function onTouchMove(event) {
    if (event.changedTouches.length == 1) {
        const realTarget = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        onTableMouseMove({ target: realTarget, which: touchOpenMode ? 1 : 3 });
    }

    if (!isMultiTouch) {
        event.preventDefault();
        return false;
    }
}

function updateModeButtonPosition() {
    const lowerleft = [window.pageXOffset, (window.pageYOffset + window.innerHeight)];
    const lowerright = [(lowerleft[0] + window.innerWidth), lowerleft[1]];
    const zoomFactor = window.innerWidth / document.documentElement.clientWidth;

    // console.log('lowerLeft = ', lowerleft, 'lower right: ', lowerright, 'zoom factor: ', zoomFactor)

    modeButton.style.width = (80 * zoomFactor) + 'px';
    modeButton.style.height = modeButton.style.width;
    modeButton.style.left = (lowerleft[0] + (25 * zoomFactor)) + 'px';
    modeButton.style.top = (lowerleft[1] - modeButton.offsetHeight - (25 * zoomFactor)) + 'px';
    // // el.style.fontSize = parseInt(zoomFactor*60) + 'px';
}

function switchModeButtonClicked(event) {
    if (this.dataset.mode == 'filled') {
        this.dataset.mode = 'empty';
        this.style.backgroundColor = 'rgba(170, 170, 170, 0.5)';

        touchOpenMode = false;

    } else {
        this.dataset.mode = 'filled';
        this.style.backgroundColor = 'rgba(25, 149, 250, 0.5)';


        touchOpenMode = true;
    }
}


/* -------------------- */
/* ---- NETWORKING ---- */
/* -------------------- */
function updateFieldOnOtherActionPerformed(otherFieldState) {
    for (let y = 0; y < currentFieldSize.height; y++) {
        for (let x = 0; x < currentFieldSize.width; x++) {
            const fieldValue = otherFieldState[y][x];

            if (fieldValue === 1) {
                getCell(x, y).classList.add('correctother');
            } else if (fieldValue === -1) {
                getCell(x, y).classList.add('mistakeother');
            }
        }
    }
}



/* ---------------- */
/* ----- UTIL ----- */
/* ---------------- */
function getCell(x, y) {
    // either get it by using CSS selector like this: document.querySelectorAll('.cell[data-x="1"][data-y="1"]')
    // but it should be way faster to use the children and cell properties of the table/tbody (as far as I have tested it)
    return fieldTable.children[y + 1].cells[x + 1];
}

function openCell(x, y, leftclick) {
    const cellToOpen = getCell(x, y);
    const cellMarked = currentField.field[y][x] == 1;
    let correct = false;

    if (leftclick && cellMarked) {
        correct = true;
    }
    if (!leftclick && !cellMarked) {
        correct = true;
    }

    if (!cellToOpen.classList.contains('opened')) {
        cellToOpen.classList.add('opened');

        if (!correct) {
            cellToOpen.classList.add('mistake');
            currentActions[y][x] = -1;
        } else {
            currentActions[y][x] = 1;
        }

        return { status: correct ? 'correct' : 'mistake' };
    } else {
        return { status: 'already-open' };
    }
}


function isFieldDone() {
    return currentActions.flat().every(f => f != 0);
}

function getMistakeCount() {
    return currentActions.flat().reduce((a, b) => { return (b == -1) ? a + 1 : a }, 0);
}