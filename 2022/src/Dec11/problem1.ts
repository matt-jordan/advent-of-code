import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/Dec11/input`;

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

class Equation {
    left: string;
    operator: string;
    right: string;

    constructor(config: string[]) {
        this.left = config[0];
        this.operator = config[1];
        this.right = config[2];
    }

    evaluate(num: number) {
        let debug = '  Worry level ';
        let left: number;
        if (this.left !== 'old') {
            left = Number(this.left);
        } else {
            left = num;
        }

        let right: number;
        if (this.right !== 'old') {
            right = Number(this.right);
        } else {
            right = num;
        }

        if (this.operator === '+') {
            debug += `increases by ${right} to ${left + right}`;
            console.log(debug);
            return left + right;
        } else if (this.operator === '*') {
            debug += `is multiplied by ${right} to ${left * right}`;
            console.log(debug);
            return left * right;
        } else {
            throw new Error(`Unknown operator ${this.operator}`);
        }
    }
}

class Monkey {
    id: number;
    items: number[];
    op: Equation;
    test: number;
    trueMonkey: number;
    falseMonkey: number;
    inspectionCount: number;

    constructor(instructionSet: string[]) {
        if (instructionSet.length !== 6) {
            throw new Error(`Invalid instruction set length: ${instructionSet.length}`);
        }

        this.id = Number(instructionSet[0].substring(7, instructionSet[0].indexOf(':', 7)).trim());
        this.items = instructionSet[1].substring(instructionSet[1].indexOf(':') + 1, instructionSet[1].length).trim().split(',').map(s => Number(s));
        this.op = new Equation(instructionSet[2].substring(instructionSet[2].indexOf('=') + 1, instructionSet[2].length).trim().split(' '));
        this.test = Number(instructionSet[3].substring(instructionSet[3].indexOf('by') + 2, instructionSet[3].length).trim());
        this.trueMonkey = Number(instructionSet[4].substring(instructionSet[4].lastIndexOf(' '), instructionSet[4].length));
        this.falseMonkey = Number(instructionSet[5].substring(instructionSet[5].lastIndexOf(' '), instructionSet[5].length));
        this.inspectionCount = 0;
    }

    processRound(monkeys: Monkey[]) {
        console.log(`Monkey ${this.id}`);
        while (this.items.length > 0) {
            let item = this.items.splice(0, 1)[0];
            console.log(`  Monkey inspects an item with worry level of ${item}.`);
            this.inspectionCount++;
            item = Math.floor(this.op.evaluate(item) / 3);
            console.log(`  Monkey gets bored with item. Worry level is divided by 3 to ${item}`);
            const test: number = item % this.test;
            let monkeyIndex: number;
            if (test === 0) {
                console.log(`  Current worry level is divisible by ${this.test}.`);
                monkeyIndex = this.trueMonkey;
            } else {
                console.log(`  Current worry level is not divisible by ${this.test}.`);
                monkeyIndex = this.falseMonkey;
            }
            console.log(`  Item with worry level ${item} is thrown to monkey ${monkeyIndex}`);
            const monkey = monkeys[monkeyIndex];
            if (monkey.id !== monkeyIndex) {
                throw new Error(`Monkey ${monkey.id} does not have the index ${monkeyIndex} we expected`);
            }
            monkey.items.push(item);
        }
    }
}


let lineCount: number = 0
let monkeyInstructions: string[] = [];
file.on('line', (line: string) => {
    lineCount++;
    if (line === '') {
        return;
    }
    monkeyInstructions.push(line);
});

file.on('close', () => {
    const monkeys: Monkey[] = [];
    for (let i = 0; i < monkeyInstructions.length; i++) {
        if (monkeyInstructions[i].startsWith('Monkey')) {
            const monkey = new Monkey(monkeyInstructions.slice(i, i + 6));
            monkeys.push(monkey);
        }
    }

    for (let i = 1; i < 21; i++) {
        console.log(`Round ${i}`);
        monkeys.forEach((monkey) => {
            monkey.processRound(monkeys);
        });
        monkeys.forEach((monkey) => {
            console.log(`Monkey ${monkey.id}: ${monkey.items.join(',')}`);
        });
    }

    monkeys.forEach((monkey) => {
        console.log(`Monkey ${monkey.id} inspected items ${monkey.inspectionCount} times.`);
    });

    const inspectionCounts = monkeys.map((m) => m.inspectionCount).sort((a, b) => b - a);
    console.log(`Monkey business: ${inspectionCounts[0] * inspectionCounts[1]}`);
});
