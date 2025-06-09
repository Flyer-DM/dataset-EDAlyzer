import { useState, useMemo } from "react";
import MyInput from '../UI/input/MyInput'
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

    const [searchTerm, setSearchTerm] = useState("");
    const filteredCols = numericCols.filter(col =>
        col.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [selectedCols, setSelectedCols] = useState(
        numericCols.slice(0, 10)
    );

    const toggleCol = (col) => {
        setSelectedCols((prev) => {
            if (prev.includes(col)) {
                return prev.filter((c) => c !== col);
            } else if (prev.length < 10) {
                return [...prev, col];
            } else {
                return prev;
            }
        });
    };

    const correlationMatrix = useMemo(() => {
        const matrix = selectedCols.map((col1) => {
            const x = df[col1].values.map(Number);
            return selectedCols.map((col2) => {
                const y = df[col2].values.map(Number);
                return computePearsonCorrelation(x, y);
            });
        });
        return matrix;
    }, [selectedCols, df]);

    return (
        <div className="corr-container">
            {numericCols.length > 10 && (
                <div className="corr-select-container">
                    <MyInput
                        type="text"
                        placeholder="Поиск признака..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {searchTerm.length > 0 && filteredCols.length > 0 && (
                        <div className="select-features-block">
                            {filteredCols.map((col) => {
                                const selected = selectedCols.includes(col);
                                const isDisabled = !selected && selectedCols.length >= 10;

                                return (
                                    <div
                                        key={col}
                                        onClick={() => {
                                            if (selected || !isDisabled) toggleCol(col);
                                        }}
                                        className="feature-block"
                                        style={{
                                            backgroundColor: selected ? "#eef" : "#f0f0f0",
                                            color: selected ? "#000" : "#333",
                                            border: `1px solid ${selected ? "#ccc" : "#ccc"}`,
                                            cursor: isDisabled ? "not-allowed" : "pointer",
                                            opacity: isDisabled ? 0.5 : 1
                                        }}
                                    >
                                        {col}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <p className="selected-info">Выберите до 10 признаков (выбрано: {selectedCols.length})</p>
                    {selectedCols.length > 0 && (
                        <div className="selected-features-block">
                            {selectedCols.map(col => (
                                <div className="selected-feature-block" key={col} onClick={() => toggleCol(col)}>
                                    {col} ✕
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <PearsonHeatmap z={correlationMatrix} x={selectedCols} y={selectedCols}></PearsonHeatmap>
        </div>
    );
}
