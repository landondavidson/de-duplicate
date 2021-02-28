import { deDuplicateRecords, indexSymbol } from '../lodash-service';

test('deDuplicateRecords: no duplicate records', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:30:20+00:00',
        },
        {
            _id: 'edu45238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:31:20+00:00',
        },
    ];
    const expectedRecords = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:30:20+00:00',
            [indexSymbol]: 0,
        },
        {
            _id: 'edu45238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:31:20+00:00',
            [indexSymbol]: 1,
        },
    ];
    expect(deDuplicateRecords(records, ['_id'], 'entryDate', true)).toEqual(expectedRecords);
});
test('deDuplicateRecords: one duplicate record with one resolution key', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:30:20+00:00',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:31:20+00:00',
        },
    ];
    const expectedRecords = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:31:20+00:00',
            [indexSymbol]: 1,
        },
    ];
    expect(deDuplicateRecords(records, ['_id'], 'entryDate', true)).toEqual(expectedRecords);
});

test('deDuplicateRecords: one duplicate record with one resolution key and with a resolution conflict and take last', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:30:20+00:00',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:30:20+00:00',
        },
    ];
    const expectedRecords = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:30:20+00:00',
            [indexSymbol]: 1,
        },
    ];
    expect(deDuplicateRecords(records, ['_id'], 'entryDate', true)).toEqual(expectedRecords);
});

test("deDuplicateRecords: one duplicate record with one resolution key and with a resolution conflict and don't take last", () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:30:20+00:00',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:30:20+00:00',
        },
    ];
    const expectedRecords = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:30:20+00:00',
        },
    ];
    expect(deDuplicateRecords(records, ['_id'], 'entryDate', false)).toEqual(expectedRecords);
});
test('deDuplicateRecords: two duplicate records with two resolution keys', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:31:20+00:00',
        },
        {
            _id: 'edu45238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:32:20+00:00',
        },
    ];
    const expectedRecords = [
        {
            _id: 'edu45238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:32:20+00:00',
        },
    ];
    expect(deDuplicateRecords(records, ['_id', 'email'], 'entryDate', false)).toEqual(
        expectedRecords
    );
});

test('deDuplicateRecords: two duplicate records with two resolution keys and with a resolution conflict and take last', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
        {
            _id: 'edu45238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
    ];
    const expectedRecords = [
        {
            _id: 'edu45238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
            [indexSymbol]: 2,
        },
    ];
    expect(deDuplicateRecords(records, ['_id', 'email'], 'entryDate', true)).toEqual(
        expectedRecords
    );
});

test('deDuplicateRecords: two duplicate records with two reversed resolution keys and with a resolution conflict and take last', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
        {
            _id: 'edu45238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
    ];
    const expectedRecords = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:31:30+00:00',
            [indexSymbol]: 0,
        },
        {
            _id: 'edu45238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
            [indexSymbol]: 2,
        },
    ];
    expect(deDuplicateRecords(records, ['email', '_id'], 'entryDate', true)).toEqual(
        expectedRecords
    );
});

test("deDuplicateRecords: two duplicate records with two resolution keys and with a resolution conflict and don't take last", () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
        {
            _id: 'edu45238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
    ];
    const expectedRecords = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
    ];
    expect(deDuplicateRecords(records, ['_id', 'email'], 'entryDate', false)).toEqual(
        expectedRecords
    );
});
test('deDuplicateRecords: two duplicate records with a resolution key that does not exist in the records', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
        {
            _id: 'edu45238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
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
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:31:30+00:00',
        },
        {
            _id: 'edu45238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:31:30+00:00',
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
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:30:20+00:00',
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
    expect(deDuplicateRecords(records, ['foo'], 'entryDate', false)).toEqual([]);
});
test('deDuplicateRecords: detection keys are an empty array', () => {
    const records = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:30:20+00:00',
        },
        {
            _id: 'edu45238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:31:20+00:00',
        },
    ];
    const expectedRecords = [
        {
            _id: 'jkj238238jdsnfsj23',
            email: 'foo@bar.com',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Street St',
            entryDate: '2014-05-07T17:30:20+00:00',
        },
        {
            _id: 'edu45238jdsnfsj23',
            email: 'mae@bar.com',
            firstName: 'Ted',
            lastName: 'Masters',
            address: '44 North Hampton St',
            entryDate: '2014-05-07T17:31:20+00:00',
        },
    ];
    expect(deDuplicateRecords(records, [], 'entryDate', false)).toEqual(expectedRecords);
});
