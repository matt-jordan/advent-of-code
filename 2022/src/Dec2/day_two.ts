import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const directory: string = path.resolve();
const filepath: string = `${directory}/2022/src/Dec2/input-day-two`;

const file = readline.createInterface({
    input: fs.createReadStream(filepath),
});

class Game {
    rock: string;
    paper: string;
    scissors: string;
    score: number;
    rounds: string[];

    constructor(rock: string, paper: string, scissors: string) {
        this.rock = rock;
        this.paper = paper;
        this.scissors = scissors;
        this.score = 0;
        this.rounds = [];
    }

    calculate(player_one: string, player_two: string) {
        let shape_score: number;
        let win_score: number;

        switch (player_one) {
        case 'A':
            player_one = 'rock';
            break;
        case 'B':
            player_one = 'paper';
            break;
        case 'C':
            player_one = 'scissors';
            break;
        default:
            throw new Error(`Unknown player one option: ${player_one}`);
        }

        switch (player_two) {
        case 'X':
            // lose
            if (player_one === 'scissors') {
                player_two = 'paper';
            } else if (player_one === 'rock') {
                player_two = 'scissors';
            } else {
                player_two = 'rock';
            }
            win_score = 0;
            break;
        case 'Y':
            // draw
            player_two = player_one;
            win_score = 3;
            break;
        case 'Z':
            // win
            if (player_one === 'scissors') {
                player_two = 'rock';
            } else if (player_one === 'rock') {
                player_two = 'paper';
            } else {
                player_two = 'scissors';
            }
            win_score = 6;
            break;
        default:
            throw new Error(`Unknown player two option: ${player_two}`);
        }

        switch (player_two) {
        case 'rock':
            shape_score = 1;
            break;
        case 'paper':
            shape_score = 2;
            break;
        case 'scissors':
            shape_score = 3;
            break;
        default:
            throw new Error(`Unknown shape for player_two: ${player_two}`);
        }

        this.rounds.push(`${player_one} ${player_two} ${win_score + shape_score}`);
        this.score += (win_score + shape_score);
    }
}

const games: Game[] = [];
games.push(new Game('X', 'Y', 'Z'));
// Okay, so I thought this puzzle was to find the right combination of X, Y, Z.
// It turns out it was much simpler. Oh well.

file.on('line', (line: string) => {
    if (line === '') {
        return;
    }

    const parts: string[] = line.split(' ');
    games.forEach((game) => {
        game.calculate(parts[0], parts[1]);
    });
});

file.on('close', () => {
    games.forEach((game) => {
        console.log(game.rounds.length);
        console.log(game.rounds);
    })
    games.forEach((game) => {
        console.log(game.score);
    });
});
