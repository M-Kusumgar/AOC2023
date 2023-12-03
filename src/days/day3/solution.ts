import { puzzleInput, sampleInput } from "./input";

const strToNum = { "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9 };
const stringNums = Object.keys(strToNum);

type NumberSegment = {
    number: null | string,
    isAdjacentToSymbol: boolean
}

type Gear = {
    row: number,
    column: number
    adjacentNumbers: number[]
}

type GearNumber = {
    number: null | string,
    adjacentGears: MatrixPoint[]
}

type MatrixPoint = {
    row: number,
    column: number
}

const addPoints = (p1: MatrixPoint, p2: MatrixPoint): MatrixPoint => {
    return { row: p1.row + p2.row, column: p1.column + p2.column };
};

const adjacentSteps: MatrixPoint[] = [
    { row: -1, column: 0 },
    { row: -1, column: 1 },
    { row: 0, column: 1 },
    { row: 1, column: 1 },
    { row: 1, column: 0 },
    { row: 1, column: -1 },
    { row: 0, column: -1 },
    { row: -1, column: -1 },
]

const isSymbolAdjacent = (matrix: string[][], rowIndex: number, columnIndex: number) => {
    const rowLimit = matrix.length;
    const columnLimit = matrix[0].length;
    const point: MatrixPoint = { row: rowIndex, column: columnIndex };
    const isInLimits = (point: MatrixPoint) => point.row < rowLimit && point.row >= 0 && point.column < columnLimit && point.column >= 0;
    return adjacentSteps.some(step => {
        const adjPoint = addPoints(point, step);
        if (isInLimits(adjPoint)) {
            const adjPointChar = matrix[adjPoint.row][adjPoint.column];
            if (adjPointChar !== "." && !stringNums.includes(adjPointChar)) {
                return true;
            }
        }
        return false;
    });
};

const part1 = (input: string) => {
    const matrix = input.split("\n").map(line => line.split(""));
    let sum = 0;
    matrix.forEach((row, rowIndex) => {
        const numberSegment: NumberSegment = {
            number: null,
            isAdjacentToSymbol: false
        };
        for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
            const char = row[columnIndex];
            if (!stringNums.includes(char)) {
                if (numberSegment.isAdjacentToSymbol) {
                    sum += Number(numberSegment.number);
                }
                numberSegment.number = null;
                numberSegment.isAdjacentToSymbol = false;
            } else {
                if (numberSegment.number === null) {
                    numberSegment.number = char;
                } else {
                    numberSegment.number += char;
                }

                if (!numberSegment.isAdjacentToSymbol) {
                    numberSegment.isAdjacentToSymbol = isSymbolAdjacent(matrix, rowIndex, columnIndex);
                }

                if (columnIndex === row.length - 1 && numberSegment.isAdjacentToSymbol) {
                    sum += Number(numberSegment.number);
                }
            }
        }
    });
    return sum;
};

const insertAdjacentGears = (matrix: string[][], gearNumber: GearNumber, rowIndex: number, columnIndex: number) => {
    const rowLimit = matrix.length;
    const columnLimit = matrix[0].length;
    const point: MatrixPoint = { row: rowIndex, column: columnIndex };
    const isInLimits = (point: MatrixPoint) => point.row < rowLimit && point.row >= 0 && point.column < columnLimit && point.column >= 0;
    adjacentSteps.forEach(step => {
        const adjPoint = addPoints(point, step);
        if (isInLimits(adjPoint)) {
            const adjPointChar = matrix[adjPoint.row][adjPoint.column];
            if (adjPointChar === "*") {
                const gearIndex = gearNumber.adjacentGears.findIndex(g => g.row === adjPoint.row && g.column === adjPoint.column);
                if (gearIndex === -1) {
                    gearNumber.adjacentGears.push(adjPoint);
                }
            }
        }
    });
};

const part2 = (input: string) => {
    const matrix = input.split("\n").map(line => line.split(""));
    let sum = 0;
    const gears: Gear[] = [];
    matrix.forEach((row, rowIndex) => {
        const gearNumber: GearNumber = {
            number: null,
            adjacentGears: []
        };
        for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
            const char = row[columnIndex];
            if (!stringNums.includes(char)) {
                if (gearNumber.adjacentGears.length !== 0) {
                    const numeric = Number(gearNumber.number);
                    gearNumber.adjacentGears.forEach(gearCoords => {
                        const gearIndex = gears.findIndex(g => g.row === gearCoords.row && g.column === gearCoords.column);
                        if (gearIndex === -1) {
                            gears.push({ ...gearCoords, adjacentNumbers: [numeric] });
                        } else {
                            gears[gearIndex].adjacentNumbers.push(numeric);
                        }
                    });
                }
                gearNumber.number = null;
                gearNumber.adjacentGears = [];
            } else {
                if (gearNumber.number === null) {
                    gearNumber.number = char;
                } else {
                    gearNumber.number += char;
                }

                insertAdjacentGears(matrix, gearNumber, rowIndex, columnIndex);

                if (columnIndex === row.length - 1 && gearNumber.adjacentGears.length !== 0) {
                    const numeric = Number(gearNumber.number);
                    gearNumber.adjacentGears.forEach(gearCoords => {
                        const gearIndex = gears.findIndex(g => g.row === gearCoords.row && g.column === gearCoords.column);
                        if (gearIndex === -1) {
                            gears.push({ ...gearCoords, adjacentNumbers: [numeric] });
                        } else {
                            gears[gearIndex].adjacentNumbers.push(numeric);
                        }
                    });
                }
            }
        }
    });

    gears.forEach(gear => {
        if (gear.adjacentNumbers.length === 2) {
            sum += gear.adjacentNumbers[0] * gear.adjacentNumbers[1];
        }
    });

    return sum;
};

export const part1Solution = () => part1(puzzleInput);
export const part2Solution = () => part2(puzzleInput);