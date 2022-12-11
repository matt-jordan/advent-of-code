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
    let totals: number[] = [];
    for (let y = 1; y < grid.length - 1; y++) {
        for (let x = 1; x < grid[y].length - 1; x++) {
            const value = grid[y][x];
            // top
            let top = 0;
            for (let i = y - 1; i >= 0; i--) {
                top++;
                if (grid[i][x] >= value) {
                    break;
                }
            }

            // left
            let left = 0;
            for (let i = x - 1; i >= 0; i--) {
                left++;
                if (grid[y][i] >= value) {
                    break;
                }
            }

            // right
            let right = 0;
            for (let i = x + 1; i < grid[y].length; i++) {
                right++;
                if (grid[y][i] >= value) {
                    break;
                }
            }

            // bottom
            let bottom = 0;
            for (let i = y + 1; i < grid.length; i++) {
                bottom++;
                if (grid[i][x] >= value) {
                    break;
                }
            }
            const totalValue = top * left * right * bottom;
            totals.push(totalValue);
        }
    }
    console.log(totals.sort((a, b) => b - a)[0]);
});
