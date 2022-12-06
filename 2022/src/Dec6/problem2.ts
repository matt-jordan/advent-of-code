import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/Dec6/input`;

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

function parseBuffer(buffer: string, length: number) {

    let currentString = '';
    for (let i = 0; i < buffer.length; i++) {
        currentString += buffer[i];
        if (currentString.length > length) {
            currentString = currentString.slice(1, length + 1);
        }

        if (currentString.length === length) {
            const unique = [...new Set(currentString)].join('');
            if (unique.length === length) {
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

    position = parseBuffer(line, 14);
});

file.on('close', () => {
    console.log(`Start of packet in buffer: ${position}`);
});
