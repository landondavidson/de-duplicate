import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const outputPath = path.join(__dirname, 'result.json');
beforeEach(() => {
    if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
    }
});
afterAll(() => {
    if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
    }
});
test('de-duplicate cli: should show help', (done) => {
    const deDuplicate = spawn('node', ['-r', 'ts-node/register', 'src/index.ts', '--help']);
    const expected = `Usage: de-duplicate [options]

Options:
  -V, --version                   output the version number
  -d, --debug                     output extra debugging
  -i, --in <inputFile>            JSON input file to de-duplicate
  -o, --out <outputFile>          path and name of the result JSON
  -a, --array-key <key>           the name of the property containing the array
  -k, --detection-keys <keys...>  specify properties in the array objects to
                                  use to detect duplicates.  The order of the
                                  keys is significant as the keys will be
                                  evaluated in order passed in
  -r, --resolution-key <key>      specify the property that will be used to
                                  resolve duplicate conflicts
  -t, --take-last                 option that allows for when a duplicate is
                                  detected and there is no resolution to
                                  resolve the duplicate by taking the last
                                  element in the array other wise the first
                                  element will be used
  -e, --encoding <type>           the encoding used for input file (default:
                                  "utf-8")
  -s, --silent                    disable user interface for automated systems
  -h, --help                      display help for command
`;
    const error: Uint8Array[] = [];
    deDuplicate.stderr.on('data', (chunk: Uint8Array) => {
        error.push(chunk);
    });
    deDuplicate.stderr.on('end', () => {
        const output = Buffer.concat(error).toString();
        if (output) {
            fail(output);
            done();
        }
    });
    const chunks: Uint8Array[] = [];
    deDuplicate.stdout.on('error', fail);
    deDuplicate.stdout.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk);
    });

    deDuplicate.stdout.on('end', () => {
        const output = Buffer.concat(chunks).toString();
        expect(output).toBe(expected);
        done();
    });
});

test('de-duplicate cli: should show version', (done) => {
    const deDuplicate = spawn('node', ['-r', 'ts-node/register', 'src/index.ts', '-V']);
    const expected = `1.0.0
`;
    const chunks: Uint8Array[] = [];
    const error: Uint8Array[] = [];
    deDuplicate.stderr.on('data', (chunk: Uint8Array) => {
        error.push(chunk);
    });
    deDuplicate.stderr.on('end', () => {
        const output = Buffer.concat(error).toString();
        if (output) {
            fail(output);
            done();
        }
    });
    deDuplicate.stdout.on('error', fail);
    deDuplicate.stdout.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk);
    });

    deDuplicate.stdout.on('end', () => {
        const output = Buffer.concat(chunks).toString();
        expect(output).toBe(expected);
        done();
    });
});

test('de-duplicate cli: should create an output file with an array file', (done) => {
    const inputpath = path.join(__dirname, 'test-data-array.json');
    const deDuplicate = spawn('node', [
        '-r',
        'ts-node/register',
        'src/index.ts',
        '--in',
        inputpath,
        '--out',
        outputPath,
        '--detection-keys',
        '_id',
        '--resolution-key',
        'entryDate',
    ]);
    const expected =
        '[{"_id":"jkj238238jdsnfsj23","email":"foo@bar.com","firstName":"John","lastName":"Smith","address":"123 Street St","entryDate":"2014-05-07T17:30:20+00:00"},{"_id":"edu45238jdsnfsj23","email":"mae@bar.com","firstName":"Ted","lastName":"Masters","address":"44 North Hampton St","entryDate":"2014-05-07T17:31:20+00:00"}]';
    const error: Uint8Array[] = [];
    deDuplicate.stderr.on('data', (chunk: Uint8Array) => {
        error.push(chunk);
    });
    deDuplicate.stderr.on('end', () => {
        const output = Buffer.concat(error).toString();
        if (output) {
            fail(output);
            done();
        }
    });
    deDuplicate.stdout.on('end', () => {
        if (fs.existsSync(outputPath)) {
            const output = fs.readFileSync(outputPath, 'utf-8');
            expect(output).toBe(expected);
            done();
        } else {
            fail(`${outputPath} was not created`);
            done();
        }
    });
});

test('de-duplicate cli: should create an output file with an object file', (done) => {
    const inputpath = path.join(__dirname, 'test-data-object.json');
    const deDuplicate = spawn('node', [
        '-r',
        'ts-node/register',
        'src/index.ts',
        '--in',
        inputpath,
        '--out',
        outputPath,
        '--detection-keys',
        '_id',
        '--resolution-key',
        'entryDate',
        '--array-key',
        'leads',
    ]);
    const expected =
        '{"leads":[{"_id":"jkj238238jdsnfsj23","email":"foo@bar.com","firstName":"John","lastName":"Smith","address":"123 Street St","entryDate":"2014-05-07T17:30:20+00:00"},{"_id":"edu45238jdsnfsj23","email":"mae@bar.com","firstName":"Ted","lastName":"Masters","address":"44 North Hampton St","entryDate":"2014-05-07T17:31:20+00:00"}]}';
    const error: Uint8Array[] = [];
    deDuplicate.stderr.on('data', (chunk: Uint8Array) => {
        error.push(chunk);
    });
    deDuplicate.stderr.on('end', () => {
        const output = Buffer.concat(error).toString();
        if (output) {
            fail(output);
            done();
        }
    });
    deDuplicate.stdout.on('end', () => {
        if (fs.existsSync(outputPath)) {
            const output = fs.readFileSync(outputPath, 'utf-8');
            expect(output).toBe(expected);
            done();
        } else {
            fail(`${outputPath} was not created`);
            done();
        }
    });
});
test('de-duplicate cli: should return error when input file does not exist and silent flag present', (done) => {
    const deDuplicate = spawn('node', [
        '-r',
        'ts-node/register',
        'src/index.ts',
        '--in',
        'file does not exist',
        '--out',
        outputPath,
        '--detection-keys',
        '_id',
        '--resolution-key',
        'entryDate',
        '--array-key',
        'leads',
        '--silent',
    ]);
    const expectedError = `file "file does not exist" does not exist
`;
    const error: Uint8Array[] = [];
    deDuplicate.stderr.on('data', (chunk: Uint8Array) => {
        error.push(chunk);
    });
    deDuplicate.stderr.on('end', () => {
        const output = Buffer.concat(error).toString();
        if (output) {
            expect(output).toBe(expectedError);
        } else {
            fail('error not sent');
        }
        done();
    });
});
test('de-duplicate cli: should return an error if the array key does not exist in input object and silent flag is set', (done) => {
    const inputpath = path.join(__dirname, 'test-data-object.json');
    const deDuplicate = spawn('node', [
        '-r',
        'ts-node/register',
        'src/index.ts',
        '--in',
        inputpath,
        '--out',
        outputPath,
        '--detection-keys',
        '_id',
        '--resolution-key',
        'entryDate',
        '--array-key',
        'not there',
        '--silent',
    ]);
    const error: Uint8Array[] = [];
    deDuplicate.stderr.on('data', (chunk: Uint8Array) => {
        error.push(chunk);
    });
    const expectedError = `array key "not there" does not exist in file "${inputpath}"
`;
    deDuplicate.stderr.on('end', () => {
        const output = Buffer.concat(error).toString();
        if (output) {
            expect(output).toBe(expectedError);
        } else {
            fail('error not sent');
        }
        done();
    });
});
test('de-duplicate cli: should return an error if in options is missing and silent flag is set', (done) => {
    const deDuplicate = spawn('node', [
        '-r',
        'ts-node/register',
        'src/index.ts',
        '--out',
        outputPath,
        '--detection-keys',
        '_id',
        '--resolution-key',
        'entryDate',
        '--array-key',
        'not there',
        '--silent',
    ]);
    const error: Uint8Array[] = [];
    deDuplicate.stderr.on('data', (chunk: Uint8Array) => {
        error.push(chunk);
    });
    const expectedError = `the --in option is required in --silent mode
`;
    deDuplicate.stderr.on('end', () => {
        const output = Buffer.concat(error).toString();
        if (output) {
            expect(output).toBe(expectedError);
        } else {
            fail('error not sent');
        }
        done();
    });
});
test('de-duplicate cli: should return an error if in option is missing and silent flag is set', (done) => {
    const deDuplicate = spawn('node', [
        '-r',
        'ts-node/register',
        'src/index.ts',
        '--out',
        outputPath,
        '--detection-keys',
        '_id',
        '--resolution-key',
        'entryDate',
        '--array-key',
        'not there',
        '--silent',
    ]);
    const error: Uint8Array[] = [];
    deDuplicate.stderr.on('data', (chunk: Uint8Array) => {
        error.push(chunk);
    });
    const expectedError = `the --in option is required in --silent mode
`;
    deDuplicate.stderr.on('end', () => {
        const output = Buffer.concat(error).toString();
        if (output) {
            expect(output).toBe(expectedError);
        } else {
            fail('error not sent');
        }
        done();
    });
});
test('de-duplicate cli: should return an error if out option is missing and silent flag is set', (done) => {
    const inputpath = path.join(__dirname, 'test-data-object.json');
    const deDuplicate = spawn('node', [
        '-r',
        'ts-node/register',
        'src/index.ts',
        '--in',
        inputpath,
        '--detection-keys',
        '_id',
        '--resolution-key',
        'entryDate',
        '--array-key',
        'leads',
        '--silent',
    ]);
    const error: Uint8Array[] = [];
    deDuplicate.stderr.on('data', (chunk: Uint8Array) => {
        error.push(chunk);
    });
    const expectedError = `the --out option is required in --silent mode
`;
    deDuplicate.stderr.on('end', () => {
        const output = Buffer.concat(error).toString();
        if (output) {
            expect(output).toBe(expectedError);
        } else {
            fail('error not sent');
        }
        done();
    });
});
test('de-duplicate cli: should return an error if detection-keys option is missing and silent flag is set', (done) => {
    const inputpath = path.join(__dirname, 'test-data-object.json');
    const deDuplicate = spawn('node', [
        '-r',
        'ts-node/register',
        'src/index.ts',
        '--in',
        inputpath,
        '--out',
        outputPath,
        '--resolution-key',
        'entryDate',
        '--array-key',
        'leads',
        '--silent',
    ]);
    const error: Uint8Array[] = [];
    deDuplicate.stderr.on('data', (chunk: Uint8Array) => {
        error.push(chunk);
    });
    const expectedError = `the --detection-keys option is required in --silent mode
`;
    deDuplicate.stderr.on('end', () => {
        const output = Buffer.concat(error).toString();
        if (output) {
            expect(output).toBe(expectedError);
        } else {
            fail('error not sent');
        }
        done();
    });
});
test('de-duplicate cli: should return an error if resolution-key option is missing and silent flag is set', (done) => {
    const inputpath = path.join(__dirname, 'test-data-object.json');
    const deDuplicate = spawn('node', [
        '-r',
        'ts-node/register',
        'src/index.ts',
        '--in',
        inputpath,
        '--out',
        outputPath,
        '--detection-keys',
        '_id',
        '--array-key',
        'leads',
        '--silent',
    ]);
    const error: Uint8Array[] = [];
    deDuplicate.stderr.on('data', (chunk: Uint8Array) => {
        error.push(chunk);
    });
    const expectedError = `the --resolution-key option is required in --silent mode
`;
    deDuplicate.stderr.on('end', () => {
        const output = Buffer.concat(error).toString();
        if (output) {
            expect(output).toBe(expectedError);
        } else {
            fail('error not sent');
        }
        done();
    });
});
