import { useMemo, useState } from "react";
import BoxPlotPlot from '../UI/plot/BoxPlot'
import SelectSearch from '../UI/select/SelectSearch'


export default function BoxPlot({ df }) {
    const numericCols = useMemo(
        () => df.columns.filter((col, i) => df.ctypes.values[i] !== "string"),
        [df]
    );

    const [selectedCol, setSelectedCol] = useState(numericCols[0] || "");

    return (
        <>
            <SelectSearch
                options={numericCols}
                value={selectedCol}
                onChange={setSelectedCol}
            />
            <div className="number-distribution-container">
                <div className="number-distribution-inner">
                    <BoxPlotPlot df={df} selectedCol={selectedCol} />
                </div>
            </div>
        </>
    );
}