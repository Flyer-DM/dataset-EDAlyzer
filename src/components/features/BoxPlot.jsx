import { useMemo, useState } from "react";
import BoxPlotPlot from '../UI/plot/BoxPlot'


export default function BoxPlot({ df }) {
    const numericCols = useMemo(
        () => df.columns.filter((col, i) => df.ctypes.values[i] !== "string"),
        [df]
    );

    const [selectedCol, setSelectedCol] = useState(numericCols[0] || "");

    return (
        <>
            <label>
                <select
                    value={selectedCol}
                    onChange={e => setSelectedCol(e.target.value)}
                    style={{ marginLeft: 10 }}>
                    {numericCols.map(col => (
                        <option key={col} value={col}>
                            {col}
                        </option>
                    ))}
                </select>
            </label>
            <div className="number-distribution-container">
                <div className="number-distribution-inner">
                    <BoxPlotPlot df={df} selectedCol={selectedCol} />
                </div>
            </div>
        </>
    );
}