import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/Dec7/input`;

class File {
    name: string;
    size: number;

    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
    }
}

class Directory {
    size: number;
    name: string;
    files: File[];
    directories: Directory[];
    parent: Directory | undefined;

    constructor(name: string, parent: Directory | undefined) {
        this.size = 0;
        this.name = name;
        this.files = [];
        this.directories = [];
        this.parent = parent;
    }

    addFile(name: string, size: number) {
        const f = new File(name, size);
        this.files.push(f);
        this.size += size;
    }

    addDirectory(name: string) {
        const directory = new Directory(name, this);
        this.directories.push(directory);
    }

    getDirectory(name: string): Directory | undefined {
        return this.directories.find(d => d.name === name);
    }
}

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

let filesystem: Directory;
let lineCount: number = 0
file.on('line', (line: string) => {
    lineCount++;
    if (line === '') {
        return;
    }

    const tokens = line.split(' ');
    if (tokens[0] === '$') {
        if (tokens[1] === 'cd') {
            if (tokens[2] !== '..') {
                console.log(`Changing to directory: ${tokens[2]}`);
                if (!filesystem) {
                    filesystem = new Directory(tokens[2], undefined);
                } else {
                    const parent = filesystem.getDirectory(tokens[2]);
                    if (parent) {
                        filesystem = parent;
                    }
                }
            } else if (filesystem.parent) {
                console.log(`Changing to directory: ${filesystem.parent.name}`);
                filesystem = filesystem.parent;
            }
        }
    } else if (tokens[0] === 'dir') {
        // directory entry
        console.log(`Adding directory ${tokens[1]} to ${filesystem.name}`);
        filesystem.addDirectory(tokens[1]);
    } else {
        // files
        console.log(`Adding ${tokens[1]} to ${filesystem.name}`);
        filesystem.addFile(tokens[1], Number(tokens[0]));
    }
});

let candidates: number[] = [];
function traverse(dir: Directory): number {
    let size = dir.size;
    for (let i = 0; i < dir.directories.length; i++) {
        size += traverse(dir.directories[i]);
    }
    console.log(`${dir.name}: ${size}`);
    if (size <= 100000) {
        candidates.push(size);
    }
    return size;
}

file.on('close', () => {
    // Walk everything
    while (filesystem.parent) {
        filesystem = filesystem.parent;
    }
    traverse(filesystem);
    console.log(candidates.reduce((prev, cur) => prev + cur, 0));
});
