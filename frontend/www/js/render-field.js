

function renderField(tbody, field, hintsX, hintsY, fieldsize) {
    // clear table first
    while (fieldTable.childElementCount > 0)
        fieldTable.children[0].remove();

    // create first hint row
    let hintRow = document.createElement('tr');

    let emptyCell = document.createElement('td');
    emptyCell.classList.add('hint', 'empty');
    hintRow.appendChild(emptyCell);

    // add the hintsY
    for (let x = 0; x < fieldsize.width; x++) {
        let hintTd = document.createElement('td');
        hintTd.classList.add('hint', 'top');
        hintTd.innerHTML = hintsX[x].join('<br>');

        hintRow.appendChild(hintTd);
    }
    tbody.appendChild(hintRow);

    // add the other rows
    for (let y = 0; y < fieldsize.height; y++) {
        // create the row
        let row = document.createElement('tr');
        
        // first add the hint
        let hintTd = document.createElement('td');
        hintTd.classList.add('hint', 'left');
        hintTd.innerHTML = hintsY[y].join(' ');
        row.appendChild(hintTd);

        // add the cells
        for (let x = 0; x < fieldsize.width; x++) {
            let cellTd = document.createElement('td');
            cellTd.classList.add('cell', (field[y][x] === 1) ? 'marked' : 'unmarked');
            cellTd.dataset.x = x;
            cellTd.dataset.y = y;
            row.appendChild(cellTd);
        }
        tbody.appendChild(row);
    }

    return tbody;
}