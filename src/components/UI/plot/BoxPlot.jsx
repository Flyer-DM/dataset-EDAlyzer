import Plot from "react-plotly.js";

const BoxPlotPlot = ({ selectedCol, df }) => {
    if (!selectedCol || !df.columns.includes(selectedCol)) return null;

    const rawValues = df[selectedCol].values.filter(val => typeof val === "number");

    return (
        <Plot
            data={[
                {
                    y: rawValues,
                    type: "box",
                    name: selectedCol,
                    boxpoints: "outliers",
                    marker: { color: "#007bff" },
                    line: { width: 1 },
                },
            ]}
            layout={{
                title: `Box Plot: ${selectedCol}`,
                yaxis: { title: selectedCol },
                height: 400,
                width: 700,
                margin: { t: 40 },
            }}
            config={{ responsive: true }}
        />
    );
};

export default BoxPlotPlot;