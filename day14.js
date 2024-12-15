const fs = require('fs');
const raw = fs.readFileSync('./input/_14.txt', { encoding: 'utf-8' }).split('\n');

const securityConfigs = [];
const WIDTH = 101;
const HEIGHT = 103;

for (let idx = 0; idx < raw.length; idx++) {
    let [position, velocity] = raw[idx].split(' ');
    let [px, py] = position.split('=')[1].split(',').map(v => parseInt(v));
    let [vx, vy] = velocity.split('=')[1].split(',').map(v => parseInt(v));

    securityConfigs.push({ px, py, vx, vy });
}

const SECONDS = 1;

const MID_X = (WIDTH-1)/2;
const MID_Y = (HEIGHT-1)/2;

// let quad1=0, quad2=0, quad3=0, quad4=0;

// securityConfigs.forEach(({ px, py, vx, vy }) => {
//     const nextX = (px + (vx+WIDTH) * SECONDS) % WIDTH;
//     const nextY = (py + (vy+HEIGHT) * SECONDS) % HEIGHT;
//     if (nextX > MID_X) {
//         if (nextY > MID_Y) {
//             quad1++;
//         } else if (nextY < MID_Y) {
//             quad2++;
//         }
//     } else if (nextX < MID_X) {
//         if (nextY > MID_Y) {
//             quad3++;
//         } else if (nextY < MID_Y) {
//             quad4++;
//         }
//     }
//     console.log({ px, py, nextX, nextY });
// })

let step = 0;
let done = false;

let locationMap = new Set();
const formatLocationId = (x,y) => {
    return `${x}-${y}`;
}

const checkTreeShape = (y, xStart, len, output) => {
    if (output) {
        console.log(y, Array.from({ length: len }, (_, i) => i+xStart));
    }
    return Array.from({ length: len }, (_, i) => i+xStart).every(x => locationMap.has(formatLocationId(x, y)));
}

const printMap = () => {
    const print = Array.from(Array(HEIGHT), () => Array.from(Array(WIDTH), () => '-'));

    [...locationMap].forEach(v => {
        const [x,y] = v.split('-').map(v => parseInt(v));
        print[y][x] = '#';
    })

    console.log(print.map(r => r.join('')).join('\n'));
}

while (!done) {
    step++;
    locationMap = new Set();

    for (let index = 0; index < securityConfigs.length; index++) {
        const { px, py, vx, vy } = securityConfigs[index];
        const nextX = (px + (vx+WIDTH) * SECONDS) % WIDTH;
        const nextY = (py + (vy+HEIGHT) * SECONDS) % HEIGHT;
        // if (nextX > MID_X) {
        //     if (nextY > MID_Y) {
        //         quad1++;
        //     } else if (nextY < MID_Y) {
        //         quad2++;
        //     }
        // } else if (nextX < MID_X) {
        //     if (nextY > MID_Y) {
        //         quad3++;
        //     } else if (nextY < MID_Y) {
        //         quad4++;
        //     }
        // }
        securityConfigs[index].px = nextX;   
        securityConfigs[index].py = nextY;

        locationMap.add(formatLocationId(nextX,nextY));
    }

    securityConfigs.sort((a,b) => a.px - b.px || a.py - b.py);
    for (let index = 0; index < securityConfigs.length; index++) {
        const {px,py} = securityConfigs[index];
        
        if (
            checkTreeShape(py+1, px-1, 3)
            && checkTreeShape(py+2, px-2, 5)
            && checkTreeShape(py+3, px-3, 7)
            && checkTreeShape(py+4, px-4, 9)
            && checkTreeShape(py+5, px-5, 11)
            && checkTreeShape(py+6, px-6, 13)
            // && checkTreeShape(py-7, px-7, px+7)
            // && checkTreeShape(py-8, px-8, px+8)
        ) {
            done = true;
            checkTreeShape(py+1, px-1, 3, true)
            checkTreeShape(py+2, px-2, 5, true)
            checkTreeShape(py+3, px-3, 7, true)
            checkTreeShape(py+4, px-4, 9, true)
            checkTreeShape(py+5, px-5, 11, true)
            checkTreeShape(py+6, px-6, 13, true);
            break;
        }
    }

    if (step % 10000 == 0) {
        printMap();
        console.log(step);
    }
}

printMap();
console.log(step);
// console.log(quad1*quad2*quad3*quad4);