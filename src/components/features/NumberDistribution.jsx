import { useMemo, useState } from "react";
import NumberDistributionPlot from '../UI/plot/NumberDistributionPlot'


export default function NumberDestribution({ df }) {
    const numericCols = useMemo(
        () => df.columns.filter((col, i) => df.ctypes.values[i] !== "string"),
        [df]
    );

    const [selectedCol, setSelectedCol] = useState(numericCols[0]);

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
                    <NumberDistributionPlot df={df} selectedCol={selectedCol} />
                </div>
            </div>
        </>
    );
}