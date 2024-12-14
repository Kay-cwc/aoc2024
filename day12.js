const fs = require('fs');
const raw = fs.readFileSync('./input/_12.txt', { encoding: 'utf-8' });

const grid = raw.split('\n');
const MAX_R = grid.length;
const MAX_C = grid[0].length;

const getVal = (r, c) => {
    if (r < 0 || c < 0 || r >= MAX_R || c >= MAX_C) return undefined;
    return grid[r].slice(c, c+1);
}

const formatId = (r, c) => {
    return `${r}-${c}`
}

const regions = {};

const deltas = [[1,0], [0,1], [-1,0], [0,-1]];

const visited = new Set();

const allHorizontalSides = {};
const allVerticalSides = {}

const findAdjacent = (type, r, c, initR, initC) => {
    deltas.forEach(([dr, dc]) => {
        const nr = r+dr;
        const nc = c+dc;
        const nextType = getVal(nr, nc);
        
        if (nextType == type) {
            if (visited.has(formatId(nr, nc))) {
                return;
            } else {
                visited.add(formatId(nr, nc));
                regions[formatId(initR, initC)].push([nr, nc]);

                findAdjacent(type, nr, nc, initR, initC);
            };
        } else {
            // it is an edge
            const regionId = formatId(initR, initC);
            if (dr != 0) {
                const edgeId = dr == 1 ? `${r}+` : `${r}-`;
                if (!allHorizontalSides[regionId][edgeId]) {
                    allHorizontalSides[regionId][edgeId] = [c];
                } else {
                    allHorizontalSides[regionId][edgeId].push(c);
                }
            } else if (dc != 0) {
                const edgeId = dc == 1 ? `${c}+` : `${c}-`;
                if (!allVerticalSides[regionId][edgeId]) {
                    allVerticalSides[regionId][edgeId] = [r];
                } else {
                    allVerticalSides[regionId][edgeId].push(r);
                }
            }
        }
    })
}

for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    for (let c = 0; c < row.length; c++) {
        const id = formatId(r, c)
        if (visited.has(id)) continue;
        visited.add(id);
        regions[id] = [[r, c]];
        allHorizontalSides[id] = {};
        allVerticalSides[id] = {};

        findAdjacent(row[c], r, c, r, c);
    }
}

const countSides = (sidesHash) => {
    let totalSides = 0;
    Object.entries(sidesHash).forEach(([key, edges]) => {
        // count discontinuity
        edges.sort((a,b) => a-b);
        let debugSides = `${key}||${edges[0]}`

        if (edges.length == 0) return;
        if (edges.length == 1) {
            totalSides += 1;
            return
        };

        let sides = 1;

        for (let index = 1; index < edges.length; index++) {
            const prev = edges[index-1];
            const current = edges[index];
            if (current - prev != 1) {
                debugSides+='=/='
                sides++
            };
            debugSides+=`,${current}`
        }

        totalSides += sides;
    })

    return totalSides;
}

let price = 0;

for (const regionId in regions) {
    const region = regions[regionId];
    const area = region.length;
    const horizontalSides = countSides(allHorizontalSides[regionId]);
    const verticalSides = countSides(allVerticalSides[regionId]);
    price += (horizontalSides+verticalSides) * area;
}

console.log(price);
