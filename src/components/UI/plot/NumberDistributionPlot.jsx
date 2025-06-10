import Plot from "react-plotly.js";

function estimateDensity(values, bins = 100) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    const binCenters = Array.from({ length: bins }, (_, i) => min + binWidth * (i + 0.5));

    const kernel = u => Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);

    const bandwidth = 1.06 * standardDeviation(values) * Math.pow(values.length, -1 / 5);

    const yValues = binCenters.map(x =>
        values.reduce((sum, xi) => sum + kernel((x - xi) / bandwidth), 0) / (values.length * bandwidth)
    );

    return { x: binCenters, y: yValues };
}

function standardDeviation(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return Math.sqrt(arr.reduce((sum, val) => sum + (val - mean) ** 2, 0) / arr.length);
}

const NumberDistributionPlot = ({ selectedCol, df }) => {
    if (!selectedCol || !df.columns.includes(selectedCol)) return null;

    const rawValues = df[selectedCol].values.filter(val => typeof val === "number");
    const { x, y } = estimateDensity(rawValues);

    return (
        <Plot
            data={[
                {
                    x,
                    y,
                    type: "scatter",
                    mode: "lines",
                    name: "Плотность",
                    line: { color: "#007bff", width: 2 },
                    fill: "tozeroy",
                    fillcolor: "rgba(0, 123, 255, 0.2)",
                },
            ]}
            layout={{
                title: `Плотность распределения: ${selectedCol}`,
                xaxis: { title: selectedCol },
                yaxis: { title: "Плотность" },
                width: 1000,
                height: 400,
                margin: { t: 40 },
            }}
            config={{ responsive: true }}
        />
    );
};

export default NumberDistributionPlot;