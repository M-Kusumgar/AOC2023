import { sampleInput, puzzleInput, sampleInputPart2 } from "./input";

/*
******************** PART 1 ********************
*/

const findFirstAndLastNumber = (line: string) => {
    let firstNumber: number | null = null;
    let lastNumber: number | null = null;
    line.split("").forEach(char => {
        if (!isNaN(Number(char))) {
            if (firstNumber === null) {
                firstNumber = Number(char);
            }
            lastNumber = Number(char);
        }
    });
    // assupmtion that there exists a number in the string
    return [firstNumber!, lastNumber!];
};

const part1 = (input: string) => {
    let sum = 0;
    input.split("\n").forEach(line => {
        const [ firstNumber, lastNumber ] = findFirstAndLastNumber(line);
        sum += firstNumber * 10 + lastNumber;
    });
    return sum;
};

/*
******************** PART 2 ********************
*/

const numberToInt = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
const numbersInWords = Object.keys(numberToInt) as (keyof typeof numberToInt)[];
const allSubstrings = (array: string[]) => {
    const allSubstrings: string[] = [];
    array.forEach(elem => {
        let substring = "";
        elem.split("").forEach(char => {
            substring += char;
            allSubstrings.push(substring);
        });
    });
    return allSubstrings;
};

const findFirstAndLastNumberPart2 = (line: string, setOfNumberSubstrings: Set<string>) => {
    let firstNumber: number | null = null;
    let lastNumber: number | null = null;
    const chars = line.split("");
    chars.forEach((char, index) => {
        if (!isNaN(Number(char))) {
            if (firstNumber === null) {
                firstNumber = Number(char);
            }
            lastNumber = Number(char);
        } else {
            let substring = char;
            let i = index;
            let validNumber: keyof typeof numberToInt | "" = "";
            while (i < chars.length && substring.length <= Math.max(...numbersInWords.map(num => num.length))) {
                if (numbersInWords.includes(substring as any)) {
                    validNumber = substring as keyof typeof numberToInt;
                    break;
                } else if (setOfNumberSubstrings.has(substring)) {
                    i++;
                    substring += chars[i];
                    continue;
                } else {
                    break;
                }
            }
            if (validNumber) {
                if (firstNumber === null) {
                    firstNumber = numberToInt[validNumber];
                }
                lastNumber = numberToInt[validNumber];
            }
        }
    });
    return [firstNumber!, lastNumber!];
};

const part2 = (input: string) => {
    let sum = 0;
    const setOfNumberSubstrings = new Set(allSubstrings(numbersInWords));
    input.split("\n").forEach(line => {
        const [ firstNumber, lastNumber ] = findFirstAndLastNumberPart2(line, setOfNumberSubstrings);
        sum += firstNumber * 10 + lastNumber;
    });
    return sum;
};

export const part1Solution = () => part1(puzzleInput);
export const part2Solution = () => part2(puzzleInput);
