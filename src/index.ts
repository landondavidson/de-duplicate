/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-console */
import { Command, OptionValues } from 'commander';
import fs from 'fs';

import _package from '../package.json';
import { deDuplicateRecords } from './lodash-service';

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
const options = program.opts() as IOptions;
if (options.silent) {
    validateSilentOptions(options);
}
if (options.in) {
    if (!fs.existsSync(options.in) && options.silent) {
        console.error(`file "${options.in}" does not exist`);
        process.exit(1);
    }
    const inputJsonFile = fs.readFileSync(options.in, options.encoding);
    const input = JSON.parse(inputJsonFile);
    const records = options.arrayKey ? input[options.arrayKey] : input;
    if (records === undefined && options.silent) {
        console.error(`array key "${options.arrayKey}" does not exist in file "${options.in}"`);
        process.exit(1);
    }
    if (options.detectionKeys && options.resolutionKey) {
        const outputRecords = deDuplicateRecords(
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
    }
}
