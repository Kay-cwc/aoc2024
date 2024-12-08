const fs = require('fs');
const raw = fs.readFileSync('./input/_08.txt', { encoding: 'utf-8' });

// find all antionde first
const antennasByFrequency = {};

const antinodeStore = new Set();

const splitedRaw = raw.split('\n');
splitedRaw.forEach((line, r) => {
    for (let c = 0; c < line.length; c++) {
        const v = line[c];
        if (v != '.') {
            if (!antennasByFrequency[v]) {
                antennasByFrequency[v] = [];
            }
            antennasByFrequency[v].push([r,c]);
            antinodeStore.add(`${r}-${c}`)
        }
    }
});

const MAX_R = splitedRaw.length;
const MAX_C = splitedRaw[0].length;

const findAntinodes = (a1, a2) => {
    const [r1, c1] = a1
    const [r2, c2] = a2;
    const [gr, gc] = [r1-r2, c1-c2];
    const nodes = [];
    let multiplier = 1;
    while (true) {
        const node = [r1+gr*multiplier, c1+gc*multiplier];
        if (node[0] >= MAX_R || node[1] >= MAX_C || node[0] < 0 || node[1] < 0) break;
        nodes.push(node);
        multiplier++;
    }
    multiplier = 1;
    while (true) {
        const node = [r2-gr*multiplier, c2-gc*multiplier];
        if (node[0] >= MAX_R || node[1] >= MAX_C || node[0] < 0 || node[1] < 0) break;
        nodes.push(node);
        multiplier++;
    }

    return nodes;
}

const storeAntinode = ([nr, nc]) => {
    if (nr >= MAX_R || nc >= MAX_C || nr < 0 || nc < 0) return;
    antinodeStore.add(`${nr}-${nc}`);

    return [nr, nc];
}

Object.entries(antennasByFrequency).forEach(([frequency,anthennas]) => {
    anthennas.forEach((a1, i1) => {
        anthennas.slice(i1+1).forEach((a2) => {
            const nodes = findAntinodes(a1, a2);
            nodes.map(n => storeAntinode(n))
        })
    })
})

console.log(antinodeStore.size);
