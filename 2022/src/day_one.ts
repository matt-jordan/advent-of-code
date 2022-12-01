import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/input`;

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

let current: number = 0;
let max: number = -1;

file.on('line', (line: string) => {
    if (line === '') {
        max = Math.max(current, max);
        current = 0;
    } else {
        current += Number(line);
    }
});

file.on('close', () => {
    console.log(`The most calories an elf has is: ${max}`);
});
