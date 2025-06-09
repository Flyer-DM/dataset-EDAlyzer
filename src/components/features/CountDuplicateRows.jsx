export default function countDuplicateRows(values) {
    const rowCounts = new Map();
    let duplicateCount = 0;

    for (const row of values) {
        const key = JSON.stringify(row);
        const count = rowCounts.get(key) || 0;
        rowCounts.set(key, count + 1);
    }

    for (const count of rowCounts.values()) {
        if (count > 1) {
            duplicateCount += count - 1;  // считаем все повторы, кроме первого
        }
    }

    return duplicateCount;
}