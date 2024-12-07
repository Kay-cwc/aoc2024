const fs = require('fs');
const raw = fs.readFileSync('./input/_06.txt', { encoding: 'utf-8' });

const splittedInputs = raw.split('\n');
const maxRow = splittedInputs.length;
const maxCol = splittedInputs[0].length;

const obstacleByRow = Array(maxRow).fill().map(() => []); // sorted obstacle id for each row
const obstacleByCol = Array(maxCol).fill().map(() => []); // sorted obstacle id for each col
let direction = 0; // 0,1,2,3. 0 means up
let currentRow, currentCol, startingRow, startingCol;
let visited = {};

splittedInputs.forEach((lst, row) => {
    lst.split('').forEach((value, col) => {
        if (value == '.') return;

        if (value == '^') {
            currentRow = row;
            currentCol = col;
            startingRow = row;
            startingCol = col;
            return;
        }

        if (value == '#') {
            obstacleByRow[row].push(col);
            obstacleByCol[col].push(row);
        }
    })
})

// race start!

const findCloestSmaller = (arr, val) => {
    for (let index = arr.length-1; index >= 0; index--) {
        if (arr[index] < val) {
            return arr[index];
        };
    }

    return -1;
}

const findCloestLarger = (arr, val) => {
    for (let index = 0; index < arr.length; index++) {
        if (arr[index] > val) {
            return arr[index];
        };
    }

    return -1;
}

let noObstacle = false;

while (!noObstacle) {
    let nextStopRow, nextStopCol, obs;
    switch(direction) {
        case 0:
            obs = findCloestSmaller(obstacleByCol[currentCol], currentRow);
            nextStopRow = obs == -1 ? 0 : obs + 1;
            nextStopCol = currentCol;
            break;
        case 1:
            obs = findCloestLarger(obstacleByRow[currentRow], currentCol)
            nextStopRow = currentRow;
            nextStopCol = obs == -1 ? maxCol - 1 : obs - 1;
            break;
        case 2:
            obs = findCloestLarger(obstacleByCol[currentCol], currentRow);
            nextStopRow = obs == -1 ? maxRow - 1 : obs - 1;
            nextStopCol = currentCol;
            break;
        case 3:
            obs = findCloestSmaller(obstacleByRow[currentRow], currentCol)
            nextStopRow = currentRow;
            nextStopCol = obs == -1 ? 0 : obs + 1;
            break;
    }

    for (let row = Math.min(currentRow, nextStopRow); row <= Math.max(currentRow, nextStopRow); row++) {
        for (let col = Math.min(currentCol, nextStopCol); col <= Math.max(currentCol, nextStopCol); col++) {
            const key = `${row},${col}`;
            if (!visited[key]) {
                visited[key] = { 0: 0, 1: 0, 2: 0, 3: 0 };
            }
            visited[key][direction]++;
        }
    }

    noObstacle = obs == -1;
    // turn
    direction = (direction + 1) % 4;
    currentRow = nextStopRow;
    currentCol = nextStopCol;
}

const countInPart1 = Object.keys(visited).length;

let possibleLoops = 0;

for (let rr = 0; rr < maxRow-1; rr++) {
    for (let cc = 0; cc < maxCol-1; cc++) {
        const heatmapHash = {};
        let currentRow = startingRow;
        let currentCol = startingCol;
        let direction = 0;
        while (true) {
            let nextCellRow, nextCellCol;
            {
                const key = `${currentRow}-${currentCol}`;
                // console.log({currentRow: currentRow+1, currentCol: currentCol+1, direction })
                if (!heatmapHash[key]) {
                    heatmapHash[key] = { 0: 0, 1: 0, 2: 0, 3: 0 };
                }
                // check if the current cell has been visited before in the same direction
                // if yes, break the loop
                // if not, mark down this visit
                // console.log(heatmapHash[key][direction])
                if (heatmapHash[key][direction] > 0) {
                    possibleLoops++;
                    break;
                } else {
                    heatmapHash[key][direction]++;
                }
            }
    
            // project the next cell coordinate
            switch(direction) {
                case 0:
                    nextCellRow = currentRow - 1;
                    nextCellCol = currentCol;
                    break;
                case 1:
                    nextCellRow = currentRow;
                    nextCellCol = currentCol + 1;
                    break;
                case 2:
                    nextCellRow = currentRow + 1;
                    nextCellCol = currentCol;
                    break;
                case 3:
                    nextCellRow = currentRow;
                    nextCellCol = currentCol - 1;
                    break;
            }
    
            // check out of bound. break and end the loop if it goes out of bound
            if (nextCellRow < 0 || nextCellCol < 0 || nextCellRow >= maxRow || nextCellCol >= maxCol) break;
    
            // check if next step is an obstacle.
            // if next step is an obstacle, or it is time for us to place an obstacle
            // keep the next cell as the current cell, but toggle the direction
            {
                if (splittedInputs[nextCellRow].substring(nextCellCol, nextCellCol+1) == '#' || (nextCellRow==rr && nextCellCol==cc)) {
                    // need to twist the direction and not move in the next iteration
                    direction = (direction + 1) % 4;
                    nextCellRow = currentRow;
                    nextCellCol = currentCol;
                }
            }
    
            // proceed 
            currentRow = nextCellRow;
            currentCol = nextCellCol;
        }    
    }
}

console.log(possibleLoops)