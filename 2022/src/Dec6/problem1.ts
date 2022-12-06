import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/Dec6/input`;

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

function parseBuffer(buffer: string) {

    let currentString = '';
    for (let i = 0; i < buffer.length; i++) {
        currentString += buffer[i];
        if (currentString.length > 4) {
            currentString = currentString.slice(1, 5);
        }

        if (currentString.length === 4) {
            const unique = [...new Set(currentString)].join('');
            if (unique.length === 4) {
                return i + 1;
            }
        }
    }

    return -1;
}

let position: number = 0;
let lineCount: number = 0
file.on('line', (line: string) => {
    lineCount++;
    if (line === '') {
        return;
    }

    position = parseBuffer(line);
});

file.on('close', () => {
    console.log(`Start of packet in buffer: ${position}`);
});
