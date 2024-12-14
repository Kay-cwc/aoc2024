const fs = require('fs');
let raw = fs.readFileSync('./input/_13.txt', { encoding: 'utf-8' });

raw = raw.split('\n');
let idx = 0

// A costs 3 coins
// B const 1 coins
const machineConfigs = [];

while (idx < raw.length) {
    let [btnAX, btnAY] = raw[idx].split(':')[1].split(',').map(v => parseInt(v.trim().split('+')[1]));
    let [btnBX, btnBY] = raw[idx+1].split(':')[1].split(',').map(v => parseInt(v.trim().split('+')[1]));
    let [priceX, priceY] = raw[idx+2].split(':')[1].split(',').map(v => parseInt(v.trim().split('=')[1]));

    machineConfigs.push({
        btnA: { x: btnAX, y: btnAY },
        btnB: { x: btnBX, y: btnBY },
        price: { x: priceX+10000000000000, y: priceY+10000000000000 }
    })

    idx+=4;
}

let cost = 0;

const isInteger = (v) => {
    return v == Math.floor(v)
}

machineConfigs.forEach(({ btnA, btnB, price }, idx) => {
    const { x: xa, y: ya } = btnA;
    const { x: xb, y: yb } = btnB;
    const { x, y } = price;

    const b = (xa*y - x*ya) / (xa*yb - xb*ya)
    const a = (x - b*xb) / xa;

    if (isInteger(a) && isInteger(b)) {
        cost += a*3+b;
    }
})

console.log(cost);