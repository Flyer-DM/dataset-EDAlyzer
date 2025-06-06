import { useState } from 'react';
import ShowToggleButton from '../UI/button/ShowToggleButton'


function ValueCountList({ entries }) {
    const [expanded, setExpanded] = useState(false);
    const visibleLimit = 10;
    const showToggle = entries.length > visibleLimit;

    const toggleExpanded = () => setExpanded(prev => !prev);

    const visibleEntries = expanded ? entries : entries.slice(0, visibleLimit);

    return (
        <div>
            {visibleEntries.map(([val, count], idx) => (
                <div key={idx}>{`${val} - ${count}`}</div>
            ))}
            {showToggle && (
                <ShowToggleButton onClick={toggleExpanded}>
                    {expanded ? 'Скрыть' : `Показать все (+${entries.length - visibleLimit})`}
                </ShowToggleButton>
            )}
        </div>
    );
}

export default function valueCounts(values, columns) {
    const colCount = columns.length;
    const countsPerColumn = Array.from({ length: colCount }, () => ({}));

    // Подсчитываем количество каждого значения по колонкам
    for (let row of values) {
        row.forEach((val, colIdx) => {
            const strVal = String(val);
            countsPerColumn[colIdx][strVal] = (countsPerColumn[colIdx][strVal] || 0) + 1;
        });
    }

    const formattedCounts = countsPerColumn.map(colCounts => {
        const entries = Object.entries(colCounts);
        const allUnique = entries.every(([_, count]) => count === 1);

        if (allUnique) {
            return <strong key="unique">все значения уникальны</strong>;
        }

        return <ValueCountList entries={entries.sort((a, b) => b[1] - a[1])} />
    });

    return formattedCounts;
}