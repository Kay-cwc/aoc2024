const fs = require('fs');
const raw = fs.readFileSync('./input/_11.txt', { encoding: 'utf-8' });

let stones = Object.fromEntries(raw.split(' ').map(v => [v, 1]));

const TOTAL_BLINK = 75;

const blink = (v) => {
    if (v == 0) return [1];
    if (v.toString().length % 2 == 0) {
        const str = v.toString()
        const len = str.length;
        return [
            parseInt(str.slice(0, len / 2)),
            parseInt(str.slice(len / 2, len))
        ]
    }
    return [v * 2024];
}

for (let index = 0; index < TOTAL_BLINK; index++) {
    let nextStones = {};
    Object.entries(stones).map(([v, count]) => {
        const nextVal = blink(v);
        nextVal.forEach(nextCount => {
            if (!nextStones[nextCount]) {
                nextStones[nextCount] = count
            } else {
                nextStones[nextCount] += count;
            }
        })
    })

    stones = nextStones;
}

console.log(Object.values(stones).reduce((prev, curr) => prev + curr, 0));