const fs = require('fs');
const raw = fs.readFileSync('./input/_04.txt', { encoding: 'utf-8'});

// conevrt the input as a 2d array first

let grid = [[]];

for (let index = 0; index < raw.length; index++) {
    const value = raw[index];
    if (value == '\n') {
        grid.push([]);
        continue;
    }
    grid[grid.length-1].push(value);
}

const maxRow = grid.length;
const maxCol = grid[0].length;

{
    console.log('==========start of part 1==========');
    let result = 0;

    const checkAdjacentCell = (row, col, rowShift, colShift, target) => {
        if (target.length == 0) return true;
    
        const newRow = row + rowShift;
        const newCol = col + colShift;
        if (newRow < 0 || newRow >= maxRow || newCol < 0 || newCol >= maxCol) return false;
        if (grid[newRow][newCol] != target[0]) return false;
        
        return checkAdjacentCell(newRow, newCol, rowShift, colShift, target.substring(1));
    }
    
    const shiftingConfig = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ]
    
    for (let row = 0; row < grid.length; row++) {
        const rowLst = grid[row];
        for (let col = 0; col < rowLst.length; col++) {
            const value = rowLst[col];
            if (value != 'X') continue; 
            
            const r = shiftingConfig.map(([rowShift, colShift]) => checkAdjacentCell(row, col, rowShift, colShift, 'MAS'));
            const matches = r.filter(v => v).length;
            // console.log(row, col, matches);
            result += matches;
        }
    }
    
    console.log("answer of part 2: ", result);
}

{
    console.log('==========start of part 2==========');

    let result = 0;

    const shiftingConfig = [
        [[-1,-1],[1,1]],
        [[-1,1],[1,-1]],
    ]

    for (let row = 1; row < grid.length-1; row++) {
        const rowLst = grid[row];
        for (let col = 1; col < rowLst.length-1; col++) {
            const value = rowLst[col];
            if (value != 'A') continue; 
            
            const matches = shiftingConfig.map((shifts) => {
                return shifts.map(([rowShift, colShift]) => grid[row+rowShift][col+colShift]).sort().join('');
            });

            if (matches[0] == 'MS' && matches[0] == matches[1]) {
                result++;
                continue;
            }
        }
    }

    console.log("answer of part 2: ", result);
}
