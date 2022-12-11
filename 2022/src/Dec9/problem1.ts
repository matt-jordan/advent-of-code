import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/Dec9/input`;

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
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
        return new Point(this.x - point.x, this.y - point.y);
    }
}

class RopeStack {
    visits: Point[];
    head: Point;
    tail: Point;

    constructor() {
        this.visits = [];
        this.head = new Point(0, 0);
        this.tail = new Point(0, 0);
        this.addVisit(this.head);
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
                newHead = new Point(this.head.x + 1, this.head.y);
                break;
            case 'D':
                newHead = new Point(this.head.x, this.head.y + 1);
                break;
            case 'L':
                newHead = new Point(this.head.x - 1, this.head.y);
                break;
            case 'U':
                newHead = new Point(this.head.x, this.head.y - 1);
                break;
            default:
                throw new Error(`Unknown direction: ${direction}`);
            }

            this.head = newHead;
            if (!this.head.isAdjacent(this.tail)) {
                const distance = this.head.getDistance(this.tail);
                const x_adjustment: number = distance.x < 0 ? -1 : distance.x > 0 ? 1 : 0;
                const y_adjustment: number = distance.y < 0 ? -1 : distance.y > 0 ? 1 : 0;
                console.log(`Moving tail: ${x_adjustment} ${y_adjustment}`);
                this.tail =  new Point(this.tail.x + x_adjustment, this.tail.y + y_adjustment);
                this.addVisit(this.tail);
            }
            console.log(`Head: ${this.head.x},${this.head.y} | Tail: ${this.tail.x},${this.tail.y}`);
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
});

file.on('close', () => {
    console.log(stack.visits.length);
});
