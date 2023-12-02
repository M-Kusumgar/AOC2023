import { puzzleInput, sampleInput } from "./input";

const maxRed = 12;
const maxGreen = 13;
const maxBlue = 14;

const capture = (colour: string, pickString: string) => {
    return new RegExp(`([0-9]+) ${colour}`).exec(pickString)?.at(1);
};

const part1 = (input: string) => {
    let sum = 0;
    input.split("\n").forEach(line => {
        const [ game, picks ] = line.split(":");
        const id = Number(game.slice(5));
        const picksArray = picks.split(";").map(s => s.trim());
        let possibleGame = true;
        for (let i = 0; i < picksArray.length; i++) {
            const pick = picksArray[i];
            const redNum = capture("red", pick);
            if (redNum && Number(redNum) > maxRed) {
                possibleGame = false;
                break;
            }
            const greenNum = capture("green", pick);
            if (greenNum && Number(greenNum) > maxGreen) {
                possibleGame = false;
                break;
            }
            const blueNum = capture("blue", pick);
            if (blueNum && Number(blueNum) > maxBlue) {
                possibleGame = false;
                break;
            }
        }
        if (possibleGame) {
            sum += id;
        }
    });
    return sum;
};

const part2 = (input: string) => {
    let sum = 0;
    input.split("\n").forEach(line => {
        const [ _, picks ] = line.split(":");
        const picksArray = picks.split(";").map(s => s.trim());
        let minRed = 0;
        let minGreen = 0;
        let minBlue = 0;
        picksArray.forEach(pick => {
            const redNum = capture("red", pick);
            const greenNum = capture("green", pick);
            const blueNum = capture("blue", pick);
            if (redNum && Number(redNum) > minRed) {
                minRed = Number(redNum);
            }
            if (greenNum && Number(greenNum) > minGreen) {
                minGreen = Number(greenNum);
            }
            if (blueNum && Number(blueNum) > minBlue) {
                minBlue = Number(blueNum);
            }
        });
        sum += minRed * minGreen * minBlue;
    });
    return sum;
};



export const part1Solution = () => part1(puzzleInput);
export const part2Solution = () => part2(puzzleInput);