import { chain, CollectionChain } from 'lodash';

export const indexSymbol = Symbol('index');

export type RecordWithOptionIndex = Record<string, string | number | null> & {
    [indexSymbol]?: number;
};
export interface IReport {
    from: RecordWithOptionIndex;
    to: RecordWithOptionIndex;
}
export const deDuplicateRecords = (
    records: Record<string, string | number | null>[],
    detectionKeys: string[],
    resolutionKey: string,
    takeLast: boolean
): { records: RecordWithOptionIndex[]; report: IReport[] } => {
    let setIndex = takeLast;
    let report: IReport[] = [];
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
        deduplicatedRecords = Object.keys(groupedRecords).map((key) => {
            const to = maxBy(
                groupedRecords[key] as RecordWithOptionIndex[],
                resolutionKey,
                takeLast
            ) as RecordWithOptionIndex;
            const reportForGroup = (groupedRecords[key] as RecordWithOptionIndex[])
                .filter((from) => from !== to)
                .map((from) => ({ from, to }));
            const updatedReport = report.map((reportElement) => {
                const needsAnUpdate = reportForGroup.find(
                    (reportForGroupElement) => reportForGroupElement.from === reportElement.to
                );
                if (needsAnUpdate) {
                    return { from: reportElement.from, to };
                }
                return reportElement;
            });
            report = [...updatedReport, ...reportForGroup];
            return to;
        });
    }
    return { records: deduplicatedRecords as RecordWithOptionIndex[], report };
};

function maxBy(array: RecordWithOptionIndex[], key: string, takeLast: boolean) {
    let result;
    if (array == null) {
        return result;
    }
    let computed: string | number | null | undefined;
    let computedIndex = -1;
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
