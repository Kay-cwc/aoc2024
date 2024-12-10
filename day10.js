const fs = require('fs');
const raw = fs.readFileSync('./input/_10.txt', { encoding: 'utf-8' });

const grid = raw.split('\n');
const maxR = grid.length;
const maxC = grid[0].length;

const getValue = (r, c) => {
    return parseInt(grid[r].slice(c, c+1));
}

const pathCache = {};

const cachePath = (path) => {
    if (path.length == 10) {
        // index the whole path
        const end = path.pop();
        path.forEach(step => {
            if (!pathCache[step]) {
                pathCache[step] = new Set();
            }
            pathCache[step].add(end);
        });

        return [end];
    } else {
        // it hits some cell that is visited before which is proved to have access to some hills
        const ends = pathCache[path[path.length-1]]; // a set
        path.forEach(step => {
            if (!pathCache[step]) {
                pathCache[step] = new Set();
            }
            pathCache[step] = new Set([...ends, ...pathCache[step]]);
        });

        return ends;
    }
}

const checkAdjacentCell = (r, c, value, path) => {
    const results = [[1,0], [-1,0], [0,1], [0,-1]].map(([dr, dc]) => {
        const [newR, newC] = [r+dr, c+dc];
        if (newR >= maxR || newR < 0 || newC >= maxC || newC < 0) return false;

        const newValue = getValue(newR, newC);
        if ((newValue-value) != 1) return false;
        const step = `${newR}-${newC}`
        const path_ = [...path, step];

        // if (newValue == 9 || pathCache[step]) {
        //     return cachePath(path_)
        // };
        if (newValue == 9) return path_;

        return checkAdjacentCell(newR, newC, newValue, path_);
    })

    return results.filter(Boolean);
}

let score = 0;

for (let row = 0; row < maxR; row++) {
    for (let col = 0; col < maxC; col++) {
        const value = getValue(row, col);
        if (value != 0) continue;

        const paths = checkAdjacentCell(row, col, value, [`${row}-${col}`]).flat(8);
        score += paths.length;
        // score += pathCache[`${row}-${col}`]?.size || 0;
        // index all path so that the next time any path hits any of these
        // they can stop the iteration and 
    }
}

console.log(score);