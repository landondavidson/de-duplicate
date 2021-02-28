import { chain, CollectionChain } from 'lodash';

export const indexSymbol = Symbol('index');

type RecordWithOptionIndex = Record<string, string | number | null> & {
    [indexSymbol]?: number;
};
export const deDuplicateRecords = (
    records: Record<string, string | number | null>[],
    detectionKeys: string[],
    resolutionKey: string,
    takeLast: boolean
) => {
    let setIndex = takeLast;
    let deduplicatedRecords: (RecordWithOptionIndex | undefined)[] = records;
    for (const detectionKey of detectionKeys) {
        let query: CollectionChain<RecordWithOptionIndex | undefined> = chain(deduplicatedRecords);
        if (setIndex) {
            setIndex = false;
            query = (query.map((record: Record<string, string | number | null>, index: number) =>
                Object.assign({}, record, { [indexSymbol]: index })
            ) as unknown) as CollectionChain<RecordWithOptionIndex | undefined>;
        }
        const groupedRecords = query.groupBy(detectionKey).value();
        if (groupedRecords['undefined']) {
            throw new Error(`Conflict detection key ${detectionKey} does not exist on all records`);
        }
        deduplicatedRecords = Object.keys(groupedRecords).map((key) =>
            maxBy(groupedRecords[key] as RecordWithOptionIndex[], resolutionKey, takeLast)
        );
    }
    return deduplicatedRecords;
};

function maxBy(array: RecordWithOptionIndex[], key: string, takeLast: boolean) {
    let result;
    if (array == null) {
        return result;
    }
    let computed: string | number | null | undefined;
    let computedIndex: number = -1;
    for (const value of array) {
        const current = value[key];
        if (current === undefined) {
            throw new Error(
                `Unable to resolve conflict using ${key} for duplicates: ${JSON.stringify(array)}`
            );
        }
        const currentIndex = value[indexSymbol] ?? -1;
        if (computed === current && currentIndex > computedIndex && takeLast) {
            computedIndex = currentIndex;
            computed = current;
            result = value;
        }
        if (
            current !== null &&
            (computed === undefined || computed === null ? current === current : current > computed)
        ) {
            computedIndex = currentIndex;
            computed = current;
            result = value;
        }
    }
    return result;
}
