import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/Dec3/input-day-three`;

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

let group: number = 0;
const values: number[] = [];
const lines: string[] = [];
file.on('line', (line: string) => {
    if (line === '') {
        return;
    }

    lines.push(line);
    group += 1;
    if (group % 3 !== 0) {
        return;
    }

    let match: boolean = false;
    const [first, second, third] = lines;
    for (let i: number = 0; i < first.length && !match; i++) {
        if (second.includes(first.charAt(i))
            && third.includes(first.charAt(i))) {
            let num: number = first.charAt(i).charCodeAt(0);
            if (first.charAt(i) === first.charAt(i).toUpperCase()) {
                num -= 38;
            } else {
                num -= 96;
            }
            console.log(`Pushing item type ${first.charAt(i)} (${first}, ${second}, ${third}) with value ${num}`);
            values.push(num);
            match = true;
        }
    }

    lines.length = 0;
});

file.on('close', () => {
    console.log(`Total: ${values.reduce((x, y) => x + y, 0)}`)
});
