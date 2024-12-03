const reports = require('./input/_02');

{
    console.log('==========start of part 1==========')
    let safeReportCount = 0;
    reports.forEach(report => {
        let prev, current, ascending;
        let isSafe = 0;

        for (let idx = 0; idx < report.length; idx++) {
            const levels = report[idx];
            prev = current;
            current = levels;

            if (idx == 0) continue;
            // check trend
            const _ascending = current > prev;
            if (idx == 1) {
                ascending = _ascending; // only set at idx 1
            }
            if (_ascending != ascending) {
                isSafe = false;
                break;
            }
            // check difference
            const diff = Math.abs(current - prev);
            if (diff < 1 || diff > 3) {
                isSafe = false;
                break;
            }
        }

        if (isSafe) safeReportCount++;
    });

    console.log("answer of part 1: ", safeReportCount);
}

{
    console.log('==========start of part 2==========')

    const isSafeReport = (report) => {
        let prev, current, ascending;
        let defect = false;
        let idx = 0;

        while (!defect && idx < report.length - 1) {
            idx++;
            prev = report[idx-1];
            current = report[idx];
            if (ascending === undefined) {
                ascending = prev < current;
            }
            // normally we only need to check the last two item
            // however, if we find a defect and decide to tolerate it,
            // we need to double check its effect to the first item as well
            const ascending_ = prev < current;
            const diff = Math.abs(prev - current);
            if (ascending_ == ascending && diff >= 1 && diff <= 3) continue;

            if (ascending_ != ascending) {
                idx--;
            }

            defect = true;
        }

        return { defect, lastIdx: idx };
    }

    let safeReportCount = 0;

    reports.forEach(report => {
        const { defect, lastIdx } = isSafeReport(report);
        if (!defect) return safeReportCount++;
        
        // now we run the array again with dampener (either remove i-1, i, or i+1)
        const canDampen = [-1,0,1].some(v => {
            const dampener = [...report];
            dampener.splice(lastIdx+v, 1);
            return !isSafeReport(dampener).defect;
        })

        if (canDampen) return safeReportCount++;
    });

    console.log("answer of part 2: ", safeReportCount);
}
