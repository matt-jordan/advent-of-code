import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/Dec10/input`;

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

class Instruction {
    name: string;
    cycles: number;

    constructor(name: string, cycles: number) {
        this.name = name;
        this.cycles = cycles;
    }

    execute(cpu: CPU) {
        this.cycles--;
    }

    complete(cpu: CPU) {
    }
}

class NoOp extends Instruction {
    constructor() {
        super('NoOp', 1);
    }

    execute(cpu: CPU) {
        super.execute(cpu);
    }

    toString() {
        return this.name;
    }
}

class AddX extends Instruction {
    value: number;

    constructor(value: number) {
        super('AddX', 2);
        this.value = value;
    }

    execute(cpu: CPU) {
        super.execute(cpu);
    }

    complete(cpu: CPU) {
        cpu.register += this.value;
    }

    toString() {
        return `${this.name} ${this.value}`;
    }
}

class CPU {
    cycle: number;
    register: number;
    instructions: string[];
    current: Instruction | null;
    buffer: Array<string>;

    constructor(instructions: string[]) {
        this.cycle = 0;
        this.instructions = instructions;
        this.register = 1;
        this.current = null;
        this.buffer = new Array<string>(40);
    }

    execute() : boolean {
        this.cycle++;

        if (this.current && this.current.cycles === 0) {
            this.current.complete(this);
            this.current = null;
        }

        if (!this.current) {
            this.current = this.fetchInstruction();
        }

        if (!this.current) {
            return false;
        }

        this.current.execute(this);

        if (this.register >= ((this.cycle - 1) % 40) - 1 && this.register <= ((this.cycle - 1) % 40) + 1) {
            this.buffer[(this.cycle - 1) % 40] = '#';
        } else {
            this.buffer[(this.cycle - 1) % 40] = '.';
        }

        return true;
    }

    getCRTBuffer() {
        const ret: string = this.buffer.join('');
        this.buffer = new Array<string>(40);
        return ret;
    }

    fetchInstruction() : Instruction | null {
        if (this.instructions.length === 0) {
            return null;
        }

        const cmd = this.instructions.splice(0, 1);
        const tokens = cmd[0].split(' ');
        let instruction: Instruction;
        switch (tokens[0].toUpperCase()) {
        case 'NOOP':
            instruction = new NoOp();
            break;
        case 'ADDX':
            if (tokens.length !== 2) {
                throw new Error(`Incorrect number of parameters for ADDX: ${cmd}`);
            }
            instruction = new AddX(Number(tokens[1]));
            break;
        default:
            throw new Error(`Unknown instruction ${tokens[0]}`);
            break;
        }
        return instruction;
    }
}


let lineCount: number = 0
const instructions: string[] = [];

file.on('line', (line: string) => {
    lineCount++;
    if (line === '') {
        return;
    }
    instructions.push(line);
});

file.on('close', () => {
    const cpu = new CPU(instructions);
    while (cpu.execute()) {
        if (cpu.cycle % 40 === 0) {
            console.log(cpu.getCRTBuffer());
        }
    }
});
