import { exit } from "process";

const NUMBER_OF_DAYS = 25;

const getLabel = (day: number, part: number) => `Day ${day} Part ${part}`;

const benchmark = async (days: number[]) => {
    days.forEach(async day => {
        const labels = [getLabel(day, 1), getLabel(day, 2)];
        const solutions: Record<string, Function> = await import(`./days/day${day}/solution`);
        Object.values(solutions).forEach((solution, index) => {
            console.log(`=============== ${labels[index]} ===============`);
            const startTime = performance.now();
            const puzzleSolution = solution();
            const endTime = performance.now();
            const timeTaken = Math.round((endTime - startTime) * 100) / 100;
            console.log(`Time: ${timeTaken}ms`)
            console.log(`Solution: ${puzzleSolution}`);
            console.log("\n");
        });
    });
};

const main = async (days: number[]) => {
    const solutionsDict: Record<string, string> = {};
    let i = 0;
    while (i < days.length) {
        const day = days[i];
        const labels = [getLabel(day, 1), getLabel(day, 2)];
        const solutions: Record<string, Function> = await import(`./days/day${day}/solution`);
        Object.values(solutions).forEach((solution, index) => {
            solutionsDict[labels[index]] = solution();
        });
        i++;
    }
    console.table(solutionsDict);
};

const validateDays = (days: string[]) => {
    let invalidMessage = "";
    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        if (isNaN(Number(day))) {
            invalidMessage = "Please enter numbers for values of days";
            break;
        } else {
            if (!Number.isInteger(Number(day))) {
                invalidMessage = "Please enter integers for values of days";
                break;
            } else {
                if (Number(day) < 1 || Number(day) > 25) {
                    invalidMessage = "Please enter an integer between 1 and 25 for values of days";
                    break;
                }
            }
        }
    }
    return invalidMessage;
};

var args = process.argv;

const noArgs = args.length === 2;
const noSolveOrBenchmark = args.length > 2 && !["--solve", "--benchmark"].includes(args[2]);
if (noArgs || noSolveOrBenchmark) { console.log("Please either use --solve or --benchmark flags"); exit(0); }

const execFunc = args[2] === "--solve" ? main : benchmark;
if (args.length === 3) {
    const allDays = Array.from({length: NUMBER_OF_DAYS}, (_, i) => i + 1);
    execFunc(allDays);
} else if (args[3] === "--days") {
    const days = args.slice(4);
    if (days.length === 0) { console.log("Please specify which days"); exit(0); }
    const invalidMessage = validateDays(days);
    if (invalidMessage) { console.log(invalidMessage); exit(0) }

    const numberDays = days.map(day => Number(day));
    execFunc(numberDays);
};
