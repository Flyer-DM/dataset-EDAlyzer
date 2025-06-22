import Plot from "react-plotly.js";
import { schemeTableau10 } from 'd3-scale-chromatic';


const ValueCountsPlotPlot = ({ selectedCol, values }) => {

    const x = Object.keys(values);
    const y = Object.values(values);

    const colorPalette = schemeTableau10;
    const colors = x.map((_, i) => colorPalette[i % colorPalette.length])

    return (
        <Plot
            data={[
                {
                    x,
                    y,
                    type: "bar",
                    name: selectedCol,
                    marker: { color: colors },
                    text: y.map(String),
                    textposition: "auto",
                },
            ]}
            layout={{
                title: `Bar-график частоты встречаемости значений в столбце: ${selectedCol}`,
                xaxis: {
                    title: `Значения в "${selectedCol}"`,
                    tickangle: -45,
                },
                yaxis: {
                    title: "Частота",
                },
                bargap: 0.2,
                width: 1000,
                height: 400,
                margin: { t: 60 },
            }}
            config={{ responsive: true }}
        />
    );

}

export default ValueCountsPlotPlot;