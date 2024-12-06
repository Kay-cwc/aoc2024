const fs = require('fs');
const raw = fs.readFileSync('./input/_05.txt', { encoding: 'utf-8'});

const [rulesRaw, updatesRaw] = raw.split('\n\n');

// convert the rules into a hash of number=>Set(number)
const rules = rulesRaw.split('\n')
                        .reduce((prev, curr) => {
                            const [a, b] = curr.split('|');
                            if (!prev[a]) {
                                prev[a] = new Set([]);
                            }
                            prev[a].add(parseInt(b));

                            return prev;
                        }, {});

const updates = updatesRaw.split('\n').map(str => str.split(',').map(v => parseInt(v)));

const correctlyOrderedUpdates = [];
const incorrectlyOrderedUpdates = [];

const checkIsOrdered = (update) => {
    let isOrdered = true;
    for (let index = 1; index < update.length; index++) {
        const n0 = update[index-1];
        const n1 = update[index];
        isOrdered = rules[n0]?.has(n1);
        if (!isOrdered) break;
    }

    return isOrdered;
}

updates.forEach(update => {
    checkIsOrdered(update) ? correctlyOrderedUpdates.push(update) : incorrectlyOrderedUpdates.push(update);
})

const fixedOrderUpdates = [];

incorrectlyOrderedUpdates.forEach((update) => {
    const outputArr = [...update];
    for (let i = 1; i < outputArr.length; i++) {
        const n0 = outputArr[i-1];
        const n1 = outputArr[i];
        const isOrdered = rules[n0]?.has(n1);
        if (isOrdered) continue;

        outputArr[i-1] = n1;
        outputArr[i] = n0;

        // now go backward until we find the right position for the n0
        for (let j = i-1; j > 0; j--) {
            const n0 = outputArr[j-1];
            const n1 = outputArr[j];

            const isOrdered = rules[n0]?.has(n1);
            if (isOrdered) break;

            outputArr[j-1] = n1;
            outputArr[j] = n0;
        }
    }

    fixedOrderUpdates.push(outputArr);
});

let sum = correctlyOrderedUpdates.reduce((prev, current) => {
    prev += current[Math.floor(current.length / 2)];
    return prev;
}, 0)
let fixedSum = fixedOrderUpdates.reduce((prev, current) => {
    prev += current[Math.floor(current.length / 2)];
    return prev;
}, 0)

console.log(sum);
console.log(fixedSum);
