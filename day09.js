const fs = require('fs');
const raw = fs.readFileSync('./input/_09.txt', { encoding: 'utf-8' });

const occupiedSlots = []; // {startingIdx, size, fileId}[]
const freeSlots = []; // {startingIdx, size}[]

let isOccupied = true;
let fileId = 0;
let startingIdx = 0;

for (let cursor = 0; cursor < raw.length; cursor++) {
    const size = parseInt(raw[cursor]);
    if (isOccupied) {
        occupiedSlots.push({ startingIdx, size, fileId });
        fileId++;
    } else {
        freeSlots.push({ startingIdx, size });
    }

    startingIdx += size;
    isOccupied = !isOccupied;
}

let checksum = 0;
const addChecksum = (id, size, fileId) => {
    while(size > 0) {
        checksum += fileId * id
        id++;
        size--;
    }
}

// solution for part 1;

// const movedSlots = [];

// for (let freeSlotCursor = 0; freeSlotCursor < freeSlots.length; freeSlotCursor++) {
//     const freeSlot = freeSlots[freeSlotCursor];
//     if (freeSlot.startingIdx > occupiedSlots[occupiedSlots.length-1].startingIdx) break;

//     while(freeSlot.size > 0) {
//         const lastOccupiedSlot = occupiedSlots.pop();
//         if (freeSlot.startingIdx > lastOccupiedSlot.startingIdx) break;

//         if (freeSlot.size >= lastOccupiedSlot.size) {
//             freeSlot.size -= lastOccupiedSlot.size;
//             lastOccupiedSlot.startingIdx = freeSlot.startingIdx;
//             freeSlot.startingIdx += lastOccupiedSlot.size;
//             movedSlots.push(lastOccupiedSlot);
//             addChecksum(
//                 lastOccupiedSlot.startingIdx,
//                 lastOccupiedSlot.size,
//                 lastOccupiedSlot.fileId
//             )
//         } else {
//             const fragment = {
//                 startingIdx: freeSlot.startingIdx,
//                 size: freeSlot.size,
//                 fileId: lastOccupiedSlot.fileId,
//             };
//             lastOccupiedSlot.size -= freeSlot.size;
//             freeSlot.size = 0;
//             movedSlots.push(fragment);
//             occupiedSlots.push(lastOccupiedSlot);
//             addChecksum(
//                 fragment.startingIdx,
//                 fragment.size,
//                 fragment.fileId
//             )
//         }
//     }
// }

// occupiedSlots.forEach((current) => {
//     addChecksum(current.startingIdx, current.size, current.fileId);
// });

for (let occupiedCursor = occupiedSlots.length-1; occupiedCursor > 0; occupiedCursor--) {
    // try to find the first free slot
    for (let freeCursor = 0; freeCursor < freeSlots.length; freeCursor++) {
        const freeSlot = freeSlots[freeCursor];
        if (occupiedSlots[occupiedCursor].startingIdx < freeSlot.startingIdx) break;
        if (freeSlot.size < occupiedSlots[occupiedCursor].size) continue;

        occupiedSlots[occupiedCursor].startingIdx = freeSlot.startingIdx;

        if (freeSlot.size == occupiedSlots[occupiedCursor].size) {
            freeSlots.splice(freeCursor, 1);
        } else {
            freeSlots[freeCursor].size -= occupiedSlots[occupiedCursor].size;
            freeSlots[freeCursor].startingIdx += occupiedSlots[occupiedCursor].size;
        }
    }

    // get checksum
    const { startingIdx, size, fileId } = occupiedSlots[occupiedCursor];
    addChecksum(startingIdx, size, fileId);
}

console.log(checksum);


// get checksum
