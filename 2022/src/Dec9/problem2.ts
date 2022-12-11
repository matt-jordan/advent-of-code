import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/Dec9/input`;

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

class Point {
    id: number;
    x: number;
    y: number;

    constructor(id: number, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    isAdjacent(point: Point) {
        // 1, 0   0, 0
        if ((point.x - 1 === this.x || point.x + 1 === this.x || point.x === this.x) && (point.y - 1 === this.y || point.y + 1 === this.y || point.y === this.y)) {
            return true;
        }
        return false;
    }

    getDistance(point: Point) {
        return new Point(-1, this.x - point.x, this.y - point.y);
    }
}

class RopeStack {
    visits: Point[];
    knots: Point[];

    constructor() {
        this.visits = [];
        this.knots = [];
        for (let i = 0; i < 10; i++) {
            this.knots.push(new Point(i, 0, 0));
        }
        this.addVisit(this.knots[0]);
    }

    addVisit(point: Point) {
        const existing = this.visits.find((v) => v.x === point.x && v.y === point.y);
        if (!existing) {
            this.visits.push(point);
        }
    }

    move(direction: string, spaces: number) {
        console.log(`${direction} ${spaces}`);
        for (let i = 0; i < spaces; i++) {
            let newHead: Point;
            switch (direction.toUpperCase()) {
            case 'R':
                newHead = new Point(0, this.knots[0].x + 1, this.knots[0].y);
                break;
            case 'D':
                newHead = new Point(0, this.knots[0].x, this.knots[0].y + 1);
                break;
            case 'L':
                newHead = new Point(0, this.knots[0].x - 1, this.knots[0].y);
                break;
            case 'U':
                newHead = new Point(0, this.knots[0].x, this.knots[0].y - 1);
                break;
            default:
                throw new Error(`Unknown direction: ${direction}`);
            }
            this.knots[0] = newHead;
            for (let i = 0; i < 9; i++) {
                const head = this.knots[i];
                let tail = this.knots[i + 1];
                if (!head.isAdjacent(tail)) {
                    const distance = head.getDistance(tail);
                    const x_adjustment: number = distance.x < 0 ? -1 : distance.x > 0 ? 1 : 0;
                    const y_adjustment: number = distance.y < 0 ? -1 : distance.y > 0 ? 1 : 0;
                    tail =  new Point(tail.id, tail.x + x_adjustment, tail.y + y_adjustment);
                    this.knots[i + 1] = tail;
                }
            }
            this.addVisit(this.knots[9]);
        }
    }

    print() {
        const x_values = this.visits.map(p => p.x);
        const y_values = this.visits.map(p => p.y);
        const min_x = Math.min(...x_values);
        const max_x = Math.max(...x_values);
        const min_y = Math.min(...y_values);
        const max_y = Math.max(...y_values);
        for (let y = min_y; y < max_y; y++) {
            let line = '';
            for (let x = min_x; x < max_x; x++) {
                const candidates = this.knots.filter(p => p.x === x && p.y === y);
                if (candidates.length !== 0) {
                    candidates.sort((a, b) => b.id - a.id);
                    line += `${candidates[0].id}`;
                } else {
                    line += '.';
                }
            }
            console.log(line);
        }
    }
}

let lineCount: number = 0
const stack: RopeStack = new RopeStack();

file.on('line', (line: string) => {
    lineCount++;
    if (line === '') {
        return;
    }

    const tokens: string[] = line.split(' ');
    const direction: string = tokens[0];
    const spaces: number = Number(tokens[1]);
    stack.move(direction, spaces);
    stack.print();
});

file.on('close', () => {
    console.log(stack.visits.length);
});
