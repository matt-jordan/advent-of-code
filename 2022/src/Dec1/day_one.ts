import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/Dec1/input-day-one`;

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

let current: number = 0;
const calories: number[] = [];

file.on('line', (line: string) => {
    if (line === '') {
        calories.push(current);
        current = 0;
    } else {
        current += Number(line);
    }
});

file.on('close', () => {
    calories.sort((a, b) => { return a - b; }).reverse();
    const top_three: number = calories[0] + calories[1] + calories[2];
    console.log(`The top three elves are carrying: ${top_three} calories`);
});
