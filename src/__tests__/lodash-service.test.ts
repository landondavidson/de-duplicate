import { deDuplicateRecords, indexSymbol as symbol } from '../lodash-service';

test('deDuplicateRecords: no duplicate records', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:30:20+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
        {
            _id: 'edu45238jdsnfsj23',
            address: '44 North Hampton St',
            email: 'mae@bar.com',
            entryDate: '2014-05-07T17:31:20+00:00',
            firstName: 'Ted',
            lastName: 'Masters',
        },
    ];
    const expectedResult = {
        records: [
            {
                _id: 'jkj238238jdsnfsj23',
                address: '123 Street St',
                email: 'foo@bar.com',
                entryDate: '2014-05-07T17:30:20+00:00',
                firstName: 'John',
                lastName: 'Smith',
                [symbol]: 0,
            },
            {
                _id: 'edu45238jdsnfsj23',
                address: '44 North Hampton St',
                email: 'mae@bar.com',
                entryDate: '2014-05-07T17:31:20+00:00',
                firstName: 'Ted',
                lastName: 'Masters',
                [symbol]: 1,
            },
        ],
        report: [],
    };
    expect(deDuplicateRecords(records, ['_id'], 'entryDate', true)).toEqual(expectedResult);
});
test('deDuplicateRecords: one duplicate record with one resolution key', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:30:20+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            address: '44 North Hampton St',
            email: 'mae@bar.com',
            entryDate: '2014-05-07T17:31:20+00:00',
            firstName: 'Ted',
            lastName: 'Masters',
        },
    ];
    const expectedResult = {
        records: [
            {
                _id: 'jkj238238jdsnfsj23',
                address: '44 North Hampton St',
                email: 'mae@bar.com',
                entryDate: '2014-05-07T17:31:20+00:00',
                firstName: 'Ted',
                lastName: 'Masters',
                [symbol]: 1,
            },
        ],
        report: [
            {
                from: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:30:20+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                    [symbol]: 0,
                },
                to: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '44 North Hampton St',
                    email: 'mae@bar.com',
                    entryDate: '2014-05-07T17:31:20+00:00',
                    firstName: 'Ted',
                    lastName: 'Masters',
                    [symbol]: 1,
                },
            },
        ],
    };
    expect(deDuplicateRecords(records, ['_id'], 'entryDate', true)).toEqual(expectedResult);
});

test('deDuplicateRecords: one duplicate record with one resolution key and with a resolution conflict and take last', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:30:20+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            address: '44 North Hampton St',
            email: 'mae@bar.com',
            entryDate: '2014-05-07T17:30:20+00:00',
            firstName: 'Ted',
            lastName: 'Masters',
        },
    ];
    const expectedResult = {
        records: [
            {
                _id: 'jkj238238jdsnfsj23',
                address: '44 North Hampton St',
                email: 'mae@bar.com',
                entryDate: '2014-05-07T17:30:20+00:00',
                firstName: 'Ted',
                lastName: 'Masters',
                [symbol]: 1,
            },
        ],
        report: [
            {
                from: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:30:20+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                    [symbol]: 0,
                },
                to: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '44 North Hampton St',
                    email: 'mae@bar.com',
                    entryDate: '2014-05-07T17:30:20+00:00',
                    firstName: 'Ted',
                    lastName: 'Masters',
                    [symbol]: 1,
                },
            },
        ],
    };
    expect(deDuplicateRecords(records, ['_id'], 'entryDate', true)).toEqual(expectedResult);
});

test("deDuplicateRecords: one duplicate record with one resolution key and with a resolution conflict and don't take last", () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:30:20+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            address: '44 North Hampton St',
            email: 'mae@bar.com',
            entryDate: '2014-05-07T17:30:20+00:00',
            firstName: 'Ted',
            lastName: 'Masters',
        },
    ];
    const expectedResult = {
        records: [
            {
                _id: 'jkj238238jdsnfsj23',
                address: '123 Street St',
                email: 'foo@bar.com',
                entryDate: '2014-05-07T17:30:20+00:00',
                firstName: 'John',
                lastName: 'Smith',
            },
        ],
        report: [
            {
                from: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '44 North Hampton St',
                    email: 'mae@bar.com',
                    entryDate: '2014-05-07T17:30:20+00:00',
                    firstName: 'Ted',
                    lastName: 'Masters',
                },
                to: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:30:20+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                },
            },
        ],
    };
    expect(deDuplicateRecords(records, ['_id'], 'entryDate', false)).toEqual(expectedResult);
});
test('deDuplicateRecords: two duplicate records with two resolution keys', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            address: '44 North Hampton St',
            email: 'mae@bar.com',
            entryDate: '2014-05-07T17:31:20+00:00',
            firstName: 'Ted',
            lastName: 'Masters',
        },
        {
            _id: 'edu45238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:32:20+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
    ];
    const expectedResult = {
        records: [
            {
                _id: 'edu45238jdsnfsj23',
                address: '123 Street St',
                email: 'foo@bar.com',
                entryDate: '2014-05-07T17:32:20+00:00',
                firstName: 'John',
                lastName: 'Smith',
            },
        ],
        report: [
            {
                from: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '44 North Hampton St',
                    email: 'mae@bar.com',
                    entryDate: '2014-05-07T17:31:20+00:00',
                    firstName: 'Ted',
                    lastName: 'Masters',
                },
                to: {
                    _id: 'edu45238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:32:20+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                },
            },
            {
                from: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:31:30+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                },
                to: {
                    _id: 'edu45238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:32:20+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                },
            },
        ],
    };
    expect(deDuplicateRecords(records, ['_id', 'email'], 'entryDate', false)).toEqual(
        expectedResult
    );
});

test('deDuplicateRecords: two duplicate records with two resolution keys and with a resolution conflict and take last', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            address: '44 North Hampton St',
            email: 'mae@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'Ted',
            lastName: 'Masters',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
        {
            _id: 'edu45238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
    ];
    const expectedResult = {
        records: [
            {
                _id: 'edu45238jdsnfsj23',
                address: '123 Street St',
                email: 'foo@bar.com',
                entryDate: '2014-05-07T17:31:30+00:00',
                firstName: 'John',
                lastName: 'Smith',
                [symbol]: 2,
            },
        ],
        report: [
            {
                from: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '44 North Hampton St',
                    email: 'mae@bar.com',
                    entryDate: '2014-05-07T17:31:30+00:00',
                    firstName: 'Ted',
                    lastName: 'Masters',
                    [symbol]: 0,
                },
                to: {
                    _id: 'edu45238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:31:30+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                    [symbol]: 2,
                },
            },
            {
                from: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:31:30+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                    [symbol]: 1,
                },
                to: {
                    _id: 'edu45238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:31:30+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                    [symbol]: 2,
                },
            },
        ],
    };
    expect(deDuplicateRecords(records, ['_id', 'email'], 'entryDate', true)).toEqual(
        expectedResult
    );
});

test('deDuplicateRecords: two duplicate records with two resolution keys reversed from previous test and with a resolution conflict and take last', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            address: '44 North Hampton St',
            email: 'mae@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'Ted',
            lastName: 'Masters',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
        {
            _id: 'edu45238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
    ];
    const expectedResult = {
        records: [
            {
                _id: 'jkj238238jdsnfsj23',
                address: '44 North Hampton St',
                email: 'mae@bar.com',
                entryDate: '2014-05-07T17:31:30+00:00',
                firstName: 'Ted',
                lastName: 'Masters',
                [symbol]: 0,
            },
            {
                _id: 'edu45238jdsnfsj23',
                address: '123 Street St',
                email: 'foo@bar.com',
                entryDate: '2014-05-07T17:31:30+00:00',
                firstName: 'John',
                lastName: 'Smith',
                [symbol]: 2,
            },
        ],
        report: [
            {
                from: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:31:30+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                    [symbol]: 1,
                },
                to: {
                    _id: 'edu45238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:31:30+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                    [symbol]: 2,
                },
            },
        ],
    };
    expect(deDuplicateRecords(records, ['email', '_id'], 'entryDate', true)).toEqual(
        expectedResult
    );
});

test("deDuplicateRecords: two duplicate records with two resolution keys and with a resolution conflict and don't take last", () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            address: '44 North Hampton St',
            email: 'mae@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'Ted',
            lastName: 'Masters',
        },
        {
            _id: 'edu45238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
    ];
    const expectedResult = {
        records: [
            {
                _id: 'jkj238238jdsnfsj23',
                address: '123 Street St',
                email: 'foo@bar.com',
                entryDate: '2014-05-07T17:31:30+00:00',
                firstName: 'John',
                lastName: 'Smith',
            },
        ],
        report: [
            {
                from: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '44 North Hampton St',
                    email: 'mae@bar.com',
                    entryDate: '2014-05-07T17:31:30+00:00',
                    firstName: 'Ted',
                    lastName: 'Masters',
                },
                to: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:31:30+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                },
            },
            {
                from: {
                    _id: 'edu45238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:31:30+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                },
                to: {
                    _id: 'jkj238238jdsnfsj23',
                    address: '123 Street St',
                    email: 'foo@bar.com',
                    entryDate: '2014-05-07T17:31:30+00:00',
                    firstName: 'John',
                    lastName: 'Smith',
                },
            },
        ],
    };
    expect(deDuplicateRecords(records, ['_id', 'email'], 'entryDate', false)).toEqual(
        expectedResult
    );
});
test('deDuplicateRecords: two duplicate records with a resolution key that does not exist in the records', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            address: '44 North Hampton St',
            email: 'mae@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'Ted',
            lastName: 'Masters',
        },
        {
            _id: 'edu45238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
    ];
    expect(() => {
        deDuplicateRecords(records, ['_id', 'email'], 'foo', false);
    }).toThrow(/Unable to resolve conflict using .* for duplicates: .*/);
});

test('deDuplicateRecords: two duplicate records with a detection key that does not exist in the records', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            address: '44 North Hampton St',
            email: 'mae@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'Ted',
            lastName: 'Masters',
        },
        {
            _id: 'edu45238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:31:30+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
    ];
    expect(() => {
        deDuplicateRecords(records, ['foo'], 'entryDate', false);
    }).toThrow(/Conflict detection key .* does not exist on all records/);
});
test('deDuplicateRecords: one record in the array is undefined', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:30:20+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
        undefined,
    ];
    expect(() => {
        deDuplicateRecords(
            records as Record<string, string | number | null>[],
            ['foo'],
            'entryDate',
            false
        );
    }).toThrow(/Conflict detection key .* does not exist on all records/);
});
test('deDuplicateRecords: empty array of records', () => {
    const records: Record<string, string | number | null>[] = [];
    const expectedResult = { records: [], report: [] };
    expect(deDuplicateRecords(records, ['foo'], 'entryDate', false)).toEqual(expectedResult);
});
test('deDuplicateRecords: detection keys are an empty array', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            address: '123 Street St',
            email: 'foo@bar.com',
            entryDate: '2014-05-07T17:30:20+00:00',
            firstName: 'John',
            lastName: 'Smith',
        },
        {
            _id: 'edu45238jdsnfsj23',
            address: '44 North Hampton St',
            email: 'mae@bar.com',
            entryDate: '2014-05-07T17:31:20+00:00',
            firstName: 'Ted',
            lastName: 'Masters',
        },
    ];
    const expectedResult = {
        records: [
            {
                _id: 'jkj238238jdsnfsj23',
                address: '123 Street St',
                email: 'foo@bar.com',
                entryDate: '2014-05-07T17:30:20+00:00',
                firstName: 'John',
                lastName: 'Smith',
            },
            {
                _id: 'edu45238jdsnfsj23',
                address: '44 North Hampton St',
                email: 'mae@bar.com',
                entryDate: '2014-05-07T17:31:20+00:00',
                firstName: 'Ted',
                lastName: 'Masters',
            },
        ],
        report: [],
    };
    expect(deDuplicateRecords(records, [], 'entryDate', false)).toEqual(expectedResult);
});
