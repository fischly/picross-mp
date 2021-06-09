

function seed2field(seed, fieldsize) {
    let seededRNG = new Math.seedrandom(seed);
    let field = [];
    

    let total = 0;

    // fill the field with random 0s or 1s
    for (let y = 0; y < fieldsize.height; y++) {
        field[y] = [];
        for (let x = 0; x < fieldsize.width; x++) {
            let cellSetOrNot = (seededRNG() * 2) | 0; // (seede) random number, either 0 or 1
            field[y][x] = cellSetOrNot;
            total += cellSetOrNot;
        }
    }

    // calculate the hints based on the (seeded) random field.
    // first calculate the hints for each row
    let hintsY = [];
    for (let y = 0; y < fieldsize.height; y++) {
        hintsY[y] = [];
        let filledCellsCounter = 0;
        for (let x = 0; x < fieldsize.width; x++) {
            if (field[y][x] === 1) {
                // if the cell is set, just increase the counter
                filledCellsCounter++;
            } else if (field[y][x] === 0) {
                // if the cell is not set, add a hint, if there were filled cells before
                if (filledCellsCounter > 0) {
                    hintsY[y].push(filledCellsCounter);
                }
                // reset the counter
                filledCellsCounter = 0;
            } else {
                throw('SHOULD NOT OCCUR');
            }
        }
        // if there were filled cells after this row is done processing, we add it to the hints as well
        if (filledCellsCounter > 0) {
            hintsY[y].push(filledCellsCounter);
        }
    }

    let hintsX = [];
    for (let x = 0; x < fieldsize.width; x++) {
        hintsX[x] = [];
        let filledCellsCounter = 0;
        for (let y = 0; y < fieldsize.height; y++) {
            if (field[y][x] === 1) {
                filledCellsCounter++;
            } else if (field[y][x] === 0) {
                if (filledCellsCounter > 0) {
                    hintsX[x].push(filledCellsCounter);
                }
                filledCellsCounter = 0;
            } else {
                throw('SHOULD NOT OCCUR');
            }
        }
        if (filledCellsCounter > 0) {
            hintsX[x].push(filledCellsCounter);
        }
    }

    return {
        field: field,
        hintsX: hintsX,
        hintsY: hintsY,
        total: total
    };
}