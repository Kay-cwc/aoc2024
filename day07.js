const fs = require('fs');
const raw = fs.readFileSync('./input/_07.txt', { encoding: 'utf-8' });

const equations = raw.split('\n');
let calibrationResults = 0;

const compute = (v1, v2, operator) => {
    switch(operator) {
        case 0: return v1+v2;
        case 1: return v1*v2;
        case 2: return parseInt(`${v1}${v2}`);
    }
}

equations.forEach(equation => {
    let [answer, inputs] = equation.split(':');
    answer = parseInt(answer);
    const inputNumbers = inputs.trim().split(' ').map(v => parseInt(v));
    const operators = [0,1,2];

    let results = [inputNumbers[0]];
    let idx = 1;
    while (idx < inputNumbers.length) {
        let results_ = [];
        results.forEach(result => {
            return operators.forEach(operator => {
                let r = compute(result, inputNumbers[idx], operator);
                if (r <= answer) results_.push(r);
            })
        })
        results = results_;
        idx++;
    }

    if (results.includes(answer)) {
        calibrationResults += answer;
    }
})

console.log(calibrationResults);
