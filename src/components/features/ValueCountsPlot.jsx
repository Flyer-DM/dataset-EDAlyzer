import { useState } from "react";
import SelectSearch from '../UI/select/SelectSearch'
import ValueCountsPlotPlot from '../UI/plot/ValueCountsPlot'


export default function ValueCountsPlot({ values, columns }) {
    const [selectedCol, setSelectedCol] = useState(columns[0]);

    const colCount = columns.length;
    const countsPerColumn = Array.from({ length: colCount }, () => ({}));

    for (let row of values) {
        row.forEach((val, colIdx) => {
            const strVal = String(val);
            countsPerColumn[colIdx][strVal] = (countsPerColumn[colIdx][strVal] || 0) + 1;
        });
    }

    return (
        <>
            <SelectSearch
                options={columns}
                value={selectedCol}
                onChange={setSelectedCol}
            />
            <div className="number-distribution-container">
                <div className="number-distribution-inner">
                    <ValueCountsPlotPlot values={countsPerColumn[columns.indexOf(selectedCol)]} selectedCol={selectedCol} />
                </div>
            </div>
        </>
    );
}