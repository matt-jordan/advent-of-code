import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/Dec5/input`;

// Parsing the crate stack is kind of a pain, so we'll just
// initiatlize it
//[N]     [C]                 [Q]    
//[W]     [J] [L]             [J] [V]
//[F]     [N] [D]     [L]     [S] [W]
//[R] [S] [F] [G]     [R]     [V] [Z]
//[Z] [G] [Q] [C]     [W] [C] [F] [G]
//[S] [Q] [V] [P] [S] [F] [D] [R] [S]
//[M] [P] [R] [Z] [P] [D] [N] [N] [M]
//[D] [W] [W] [F] [T] [H] [Z] [W] [R]
// 1   2   3   4   5   6   7   8   9 

class CrateStack {
    stack: string[];

    constructor(initalStack: string[]) {
        this.stack = initalStack;
    }

    remove(count: number) {
        if (count > this.stack.length) {
            throw Error(`Cannot remove ${count} crates from stack: ${this.stack.length}`);
        }

        return this.stack.splice(0, count);
    }

    add(crates: string[]) {
        this.stack = crates.concat(this.stack);
    }

    top() {
        return this.stack[0];
    }
}

const stacks: CrateStack[] = [];
stacks.push(new CrateStack(['N', 'W', 'F', 'R', 'Z', 'S', 'M', 'D']));
stacks.push(new CrateStack(['S', 'G', 'Q', 'P', 'W']));
stacks.push(new CrateStack(['C', 'J', 'N', 'F', 'Q', 'V', 'R', 'W']));
stacks.push(new CrateStack(['L', 'D', 'G', 'C', 'P', 'Z', 'F']));
stacks.push(new CrateStack(['S', 'P', 'T']));
stacks.push(new CrateStack(['L', 'R', 'W', 'F', 'D', 'H']));
stacks.push(new CrateStack(['C', 'D', 'N', 'Z']));
stacks.push(new CrateStack(['Q', 'J', 'S', 'V', 'F', 'R', 'N', 'W']));
stacks.push(new CrateStack(['V', 'W', 'Z', 'G', 'S', 'M', 'R']));

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

let lineCount: number = 0
file.on('line', (line: string) => {
    lineCount++;
    if (line === '') {
        return;
    }

    if (line.substring(0, 4) !== 'move') {
        return;
    }

    const params: string[] = line.split(' ');
    const moveCount: number = Number(params[1]);
    const source: number = Number(params[3]) - 1;
    const destination: number = Number(params[5]) - 1;

    if (source < 0 || source > 8) {
        throw Error(`Invalid source: ${source} (${lineCount})`);
    }
    if (destination < 0 || destination > 8) {
        throw Error(`Invalid destination: ${destination} (${lineCount})`);
    }

    stacks[destination].add(stacks[source].remove(moveCount));
    console.log(`Moved ${moveCount} from ${source + 1} (${stacks[source].stack.join(',')}) to ${destination + 1} (${stacks[destination].stack.join(',')})`)
});

file.on('close', () => {
    console.log(`Final: ${stacks.map(s => s.top()).join('')}`);
});
