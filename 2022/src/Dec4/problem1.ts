import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/Dec4/input`;

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

class Assignment {
    min: number;
    max: number;

    constructor(text: string) {
        const [min_str, max_str] = text.split('-');
        this.min = Number(min_str);
        this.max = Number(max_str);
    }

    overlap(assignment: Assignment) {
        if (this.min >= assignment.min && this.max <= assignment.max) {
            return true;
        }
        return false;
    }
}

class Assignments {
    assign_1: Assignment;
    assign_2: Assignment;

    constructor(text: string) {
        const assignments = text.split(',');
        this.assign_1 = new Assignment(assignments[0]);
        this.assign_2 = new Assignment(assignments[1]);
    }

    overlap() {
        if (this.assign_1.overlap(this.assign_2) || this.assign_2.overlap(this.assign_1)) {
            return true;
        }
        return false;
    }
}

let count: number = 0;
let line_no: number = 0;
file.on('line', (line: string) => {
    line_no += 1;
    if (line === '') {
        return;
    }

    const assignments: Assignments = new Assignments(line);
    if (assignments.overlap()) {
        console.log(`${line_no}: Overlap detected`);
        count += 1;
    }
});

file.on('close', () => {
    console.log(`Total overlaps: ${count}`);
});
