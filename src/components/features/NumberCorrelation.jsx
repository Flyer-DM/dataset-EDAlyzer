import { useState, useMemo } from "react";
import Select from "react-select";
import PearsonHeatmap from '../UI/plot/PearsonHeatmap'
import '../../styles/PearsonCorrelation.css'


function computePearsonCorrelation(x, y) {
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (let i = 0; i < n; i++) {
        const dx = x[i] - meanX;
        const dy = y[i] - meanY;
        numerator += dx * dy;
        denomX += dx ** 2;
        denomY += dy ** 2;
    }
    const result = denomX && denomY ? numerator / Math.sqrt(denomX * denomY) : 0

    return result;
}

export default function NumberCorrelationHeatmap({ df }) {
    const numericCols = useMemo(
        () => df.columns.filter((col, i) => df.ctypes.values[i] !== "string"),
        [df]
    );

    const options = numericCols.map(col => ({ label: col, value: col }));

    const [selectedCols, setSelectedCols] = useState(
        options.slice(0, 10)
    );

    const correlationMatrix = useMemo(() => {
        const matrix = selectedCols.map(({ value: col1 }) => {
            const x = df[col1].values.map(Number);
            return selectedCols.map(({ value: col2 }) => {
                const y = df[col2].values.map(Number);
                return computePearsonCorrelation(x, y);
            });
        });
        return matrix;
    }, [selectedCols, df]);

    const handleChange = (selectedOptions) => {
        if (selectedOptions.length <= 10) {
            setSelectedCols(selectedOptions);
        }
    };

    return (
        <div className="corr-container">
            {numericCols.length > 10 && (
                <div className="corr-select-container">
                    <Select
                        isMulti
                        options={options}
                        value={selectedCols}
                        onChange={handleChange}
                        isOptionDisabled={() => selectedCols.length >= 10}
                        placeholder="Выберите до 10 признаков..."
                        closeMenuOnSelect={false}
                        isSearchable
                        styles={{
                            menu: base => ({ ...base, zIndex: 100 }),
                            control: base => ({
                                ...base,
                                minHeight: 38,
                                fontSize: 14,
                                borderRadius: 4,
                                borderColor: "#ccc",
                            }),
                        }}
                    />
                    <p className="selected-info">
                        Выбрано признаков: {selectedCols.length} / 10
                    </p>
                </div>
            )}
            <PearsonHeatmap
                z={correlationMatrix}
                x={selectedCols.map(col => col.value)}
                y={selectedCols.map(col => col.value)}
            />
        </div>
    );
}
