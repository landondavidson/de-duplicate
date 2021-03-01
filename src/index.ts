/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./types/inquirer-file-tree-selection-prompt/index.d.ts" />
import { exec } from 'child_process';
import { Command, OptionValues } from 'commander';
import fs from 'fs';
import handlebars from 'handlebars';
import inquirer from 'inquirer';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
import { head } from 'lodash';
import path from 'path';

import _package from '../package.json';
import { deDuplicateRecords, IReport, RecordWithOptionIndex } from './lodash-service';

interface IOptions extends OptionValues {
    arrayKey?: string;
    detectionKeys?: string[];
    encoding: BufferEncoding;
    in?: string;
    out?: string;
    resolutionKey?: string;
    silent?: boolean;
    takeLast?: boolean;
}

interface IReportViewModel {
    differences: {
        rows: {
            field: string;
            new: string | number | null;
            previous: string | number | null;
            updated: boolean;
        }[];
    }[];
    duplicateCount: number;
    duration: number;
    inputFile: string;
    outputFile: string;
    recordCount: number;
}

const getNumberWithOrdinal = (integer: number) => {
    const suffixes = ['th', 'st', 'nd', 'rd'],
        module100 = integer % 100;
    return integer + (suffixes[(module100 - 20) % 10] || suffixes[module100] || suffixes[0]);
};

const validateSilentOptions = (options: IOptions) => {
    if (!options.in) {
        console.error('the --in option is required in --silent mode');
        process.exit(1);
    }
    if (!options.out) {
        console.error('the --out option is required in --silent mode');
        process.exit(1);
    }
    if (!options.detectionKeys) {
        console.error('the --detection-keys option is required in --silent mode');
        process.exit(1);
    }
    if (!options.resolutionKey) {
        console.error('the --resolution-key option is required in --silent mode');
        process.exit(1);
    }
};
const promptForArrayKey = async (options: IOptions, input: Record<string, unknown>) => {
    const keys = Object.keys(input);
    const { arrayKey } = await inquirer.prompt([
        {
            choices: keys,
            message: 'Select the array property to de-duplicate',
            name: 'arrayKey',
            type: 'list',
        },
    ]);
    return Object.assign({}, options, { arrayKey });
};
const promptForDetectionKeys = async (
    options: IOptions,
    input: Record<string, unknown>,
    answers: string[] = []
): Promise<IOptions> => {
    const finishedChoice = 'Done selecting properties';
    const keys =
        answers.length === 0
            ? Object.keys(input)
            : [finishedChoice, ...Object.keys(input).filter((key) => !answers.includes(key))];
    const ordinal = getNumberWithOrdinal(answers.length + 1);
    const { detectionKey } = await inquirer.prompt([
        {
            choices: keys,
            message: `Select the ${ordinal} property to use to determine a duplicate record (order does matter in resolving conficts)`,
            name: 'detectionKey',
            type: 'list',
        },
    ]);
    if (detectionKey === finishedChoice) {
        return Object.assign({}, options, { detectionKeys: answers });
    } else {
        return promptForDetectionKeys(options, input, [...answers, detectionKey]);
    }
};
const promptForResolutionKey = async (
    options: IOptions,
    input: Record<string, unknown>
): Promise<IOptions> => {
    const keys = Object.keys(input).filter((key) => !options.detectionKeys?.includes(key));
    const { resolutionKey } = await inquirer.prompt([
        {
            choices: keys,
            message: `Select the property to use to resolve conflicts when duplicates are found`,
            name: 'resolutionKey',
            type: 'list',
        },
    ]);
    return Object.assign({}, options, { resolutionKey });
};
const promptForTakeLast = async (options: IOptions): Promise<IOptions> => {
    const { takeLast } = await inquirer.prompt([
        {
            message:
                'When resolving conflicts and the resolution keys are equal Should the last record be selected',
            name: 'takeLast',
            type: 'confirm',
        },
    ]);
    return Object.assign({}, options, { takeLast });
};
const promptForShowReport = async (reportPath: string): Promise<void> => {
    const { showReport } = await inquirer.prompt([
        {
            message: 'Would you like to see the report',
            name: 'showReport',
            type: 'confirm',
        },
    ]);
    if (showReport) {
        switch (process.platform) {
            case 'darwin':
                exec(`open ${reportPath}`);
                break;
            case 'win32':
                exec(`start ${reportPath}`);
                break;
            default:
                exec(`xdg-open ${reportPath}`);
                break;
        }
    }
};
const promptForInputFile = async (options: IOptions): Promise<IOptions> => {
    const { in: inAnswer } = await inquirer.prompt([
        {
            message: 'Select a file to eliminate duplicate records',
            name: 'in',
            onlyShowValid: true,
            type: 'file-tree-selection',
            validate: (inputFile_1: string) => {
                return /.+\.json/.test(inputFile_1) || fs.lstatSync(inputFile_1).isDirectory();
            },
        },
    ]);
    if (fs.lstatSync(inAnswer).isDirectory()) {
        console.log(`"${inAnswer}" is a directory.  Please choose a JSON file.`);
        return promptForInputFile(options);
    }
    return Object.assign({}, options, { in: inAnswer });
};
const promptForOutputFile = async (options: IOptions): Promise<IOptions> => {
    const directoryName = path.dirname(options.in as string);
    const defaultOutputName = path.join(directoryName, 'results.json');
    const { out } = await inquirer.prompt([
        {
            default: () => defaultOutputName,
            message: 'Enter the path to save the result of the de-duplication',
            name: 'out',
            type: 'input',
        },
    ]);
    if (fs.existsSync(out) && fs.lstatSync(out).isDirectory()) {
        console.log(`"${out}" is a directory.  Please choose a JSON file.`);
        return promptForOutputFile(options);
    }
    return Object.assign({}, options, { out });
};
const promptUserForMissingOptions = async (options: IOptions): Promise<IOptions> => {
    let promptOptions = options;
    if (!promptOptions.in) {
        promptOptions = await promptForInputFile(promptOptions);
    }
    const inputJsonFile = fs.readFileSync(promptOptions.in as string, options.encoding);
    const input = JSON.parse(inputJsonFile);
    if (!Array.isArray(input) && !promptOptions.arrayKey) {
        promptOptions = await promptForArrayKey(promptOptions, input);
    }
    const inputArray = promptOptions.arrayKey ? input[promptOptions.arrayKey] : input;
    const firstRecord = head<Record<string, unknown>>(inputArray);
    if (firstRecord) {
        if (!promptOptions.detectionKeys) {
            promptOptions = await promptForDetectionKeys(promptOptions, firstRecord);
        }
        if (!promptOptions.resolutionKey) {
            promptOptions = await promptForResolutionKey(promptOptions, firstRecord);
        }
    }
    if (promptOptions.takeLast === undefined) {
        promptOptions = await promptForTakeLast(promptOptions);
    }
    if (!promptOptions.out) {
        promptOptions = await promptForOutputFile(promptOptions);
    }
    return promptOptions;
};
const buildReport = (
    options: IOptions,
    records: RecordWithOptionIndex[],
    report: IReport[],
    duration: number
): string => {
    const template = fs.readFileSync(
        path.join(__dirname, 'templates', 'report.handlebars'),
        'utf-8'
    );
    const compiledTemplate = handlebars.compile(template);
    const differences = report.map((report) => {
        const keys = Object.keys(report.from);
        return {
            rows: keys.map((key) => ({
                field: key,
                new: report.to[key],
                previous: report.from[key],
                updated: report.to[key] !== report.from[key],
            })),
        };
    });
    const viewModel: IReportViewModel = {
        differences,
        duplicateCount: report.length,
        duration,
        inputFile: options.in as string,
        outputFile: options.out as string,
        recordCount: records.length,
    };
    const reportHtml = compiledTemplate(viewModel);
    const reportPath = path.join(path.dirname(options.out as string), 'report.html');
    fs.writeFileSync(reportPath, reportHtml);
    return reportPath;
};
inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);
const program = new Command();

program
    .name('de-duplicate')
    .version(_package.version)
    .option('-d, --debug', 'output extra debugging')
    .option('-i, --in <inputFile>', 'JSON input file to de-duplicate')
    .option('-o, --out <outputFile>', 'path and name of the result JSON')
    .option('-a, --array-key <key>', 'the name of the property containing the array')
    .option(
        '-k, --detection-keys <keys...>',
        'specify properties in the array objects to use to detect duplicates.  The order of the keys is significant as the keys will be evaluated in order passed in'
    )
    .option(
        '-r, --resolution-key <key>',
        'specify the property that will be used to resolve duplicate conflicts'
    )
    .option(
        '-t, --take-last',
        'option that allows for when a duplicate is detected and there is no resolution to resolve the duplicate by taking the last element in the array other wise the first element will be used'
    )
    .option('-e, --encoding <type>', 'the encoding used for input file', 'utf-8')
    .option('-s, --silent', 'disable user interface for automated systems');

program.parse();
const commandLineOptions = program.opts() as IOptions;
Promise.resolve()
    .then(() => {
        if (commandLineOptions.silent) {
            validateSilentOptions(commandLineOptions);
            return commandLineOptions;
        } else {
            return promptUserForMissingOptions(commandLineOptions);
        }
    })
    .then((options: IOptions) => {
        if (options.in) {
            const start = Date.now();
            if (!fs.existsSync(options.in) && options.silent) {
                console.error(`file "${options.in}" does not exist`);
                process.exit(1);
            }
            const inputJsonFile = fs.readFileSync(options.in, options.encoding);
            const input = JSON.parse(inputJsonFile);
            const records = options.arrayKey ? input[options.arrayKey] : input;
            if (records === undefined && options.silent) {
                console.error(
                    `array key "${options.arrayKey}" does not exist in file "${options.in}"`
                );
                process.exit(1);
            }
            if (options.detectionKeys && options.resolutionKey) {
                const { records: outputRecords, report } = deDuplicateRecords(
                    records,
                    options.detectionKeys,
                    options.resolutionKey,
                    options.takeLast ?? false
                );
                const output = options.arrayKey
                    ? Object.assign({}, input, { [options.arrayKey]: outputRecords })
                    : outputRecords;
                if (options.out) {
                    fs.writeFileSync(options.out, JSON.stringify(output));
                }
                const duration = Date.now() - start;
                const reportPath = buildReport(options, outputRecords, report, duration);
                if (!options.silent) {
                    promptForShowReport(reportPath);
                }
            }
        }
    });
