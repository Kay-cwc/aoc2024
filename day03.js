const fs = require('fs');
const raw = fs.readFileSync('./input/_03.txt', { encoding: 'utf-8'});

let product = 0;

// mul(498,303)
// 0123456789ABC
let startCursor = 0;
let enabled = true;

while (startCursor < raw.length) {
    // check command
    const substr = raw.substring(startCursor, startCursor+7);
    if (substr.startsWith('do()')) {
        enabled = true;
        startCursor += 4;
        continue;
    }
    if (substr.startsWith("don't()")) {
        enabled = false;
        startCursor += 7;
        continue;
    }
    if (!substr.startsWith('mul(')) {
        startCursor++;
        continue;
    };

    if (!enabled) {
        startCursor += 4;
        continue;
    }

    let endCurosor = startCursor+4;
    let mulX = '';
    let mulY = '';

    while (endCurosor < Math.min(raw.length, startCursor+4+4)) {
        if (raw[endCurosor] == ',') {
            endCurosor++;
            break;
        }
        if (isNaN(parseInt(raw[endCurosor]))) {
            startCursor = endCurosor;
            mulX = '';
            break;
        }

        mulX += raw[endCurosor];
        endCurosor++;
    }

    // cannot form a valid mul
    if (!mulX) continue;

    startCursor = endCurosor;

    while (endCurosor < Math.min(raw.length, startCursor+4)) {
        if (raw[endCurosor] == ')') {
            endCurosor++;
            break;
        }
        if (isNaN(parseInt(raw[endCurosor]))) {
            startCursor = endCurosor;
            mulY = '';
            break;
        }

        mulY += raw[endCurosor];
        endCurosor++;
    }

    if (!mulY) continue;

    startCursor = endCurosor;

    product += parseInt(mulX) * parseInt(mulY);
}

console.log('==========start of part 3==========');
console.log("answer of part 3: ", product);