import { useMemo, useState } from "react";
import NumberDistributionPlot from '../UI/plot/NumberDistributionPlot'
import SelectSearch from '../UI/select/SelectSearch'


export default function NumberDestribution({ df }) {
    const numericCols = useMemo(
        () => df.columns.filter((col, i) => df.ctypes.values[i] !== "string"),
        [df]
    );

    const [selectedCol, setSelectedCol] = useState(numericCols[0]);

    return (
        <>
            <SelectSearch
                options={numericCols}
                value={selectedCol}
                onChange={setSelectedCol}
            />
            <div className="number-distribution-container">
                <div className="number-distribution-inner">
                    <NumberDistributionPlot df={df} selectedCol={selectedCol} />
                </div>
            </div>
        </>
    );
}