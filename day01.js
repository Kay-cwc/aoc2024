const { lst1, lst2 } = require('./input/_01');

console.log('==========start of day 1==========')

let sum = 0;
lst1.forEach((d1, idx) => {
    const d2 = lst2[idx];
    sum += Math.abs(d1 - d2);
})

console.log("answer of day 1: ", sum);

console.log('==========start of part 2==========')

const lst2HM = lst2.reduce((prev, current) => {
    if (!prev[current]) {
        prev[current] = 1;
    } else {
        prev[current]++;
    }

    return prev;
}, {});

let simScore = 0;

lst1.forEach((d1) => {
    const matches = lst2HM[d1];
    if (!matches) return;
    simScore += d1 * matches;
})

console.log("answer of part 2: ", simScore);
