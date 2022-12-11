import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/Dec8/input`;

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

const grid: number[][] = [];

let lineCount: number = 0
file.on('line', (line: string) => {
    lineCount++;
    if (line === '') {
        return;
    }

    const numbers: number[] = [];
    for (let i = 0; i < line.length; i++) {
        numbers.push(Number(line.charAt(i)));
    }
    grid.push(numbers);
});

file.on('close', () => {
    let total = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const value = grid[y][x];
            // top
            let top = true;
            for (let i = y - 1; i >= 0; i--) {
                if (grid[i][x] >= value) {
                    top = false;
                }
            }

            // left
            let left = true;
            for (let i = x - 1; i >= 0; i--) {
                if (grid[y][i] >= value) {
                    left = false;
                }
            }

            // right
            let right = true;
            for (let i = x + 1; i < grid[y].length; i++) {
                if (grid[y][i] >= value) {
                    right = false;
                }
            }

            // bottom
            let bottom = true;
            for (let i = y + 1; i < grid.length; i++) {
                if (grid[i][x] >= value) {
                    bottom = false;
                }
            }

            if (top || left || right || bottom) {
                total++;
            }
        }
    }
    console.log(total);
});
