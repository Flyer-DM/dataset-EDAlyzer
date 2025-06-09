import Plot from "react-plotly.js";


const PearsonHeatmap = ({ x, y, z }) => {

    return (
        <>
            <Plot
                data={[
                    {
                        z: z,
                        x: x,
                        y: y,
                        type: "heatmap",
                        colorscale: "RdBu",
                        zmin: -1,
                        zmax: 1,
                        text: z.map(row =>
                            row.map(val => (Math.round(val * 100) / 100).toFixed(2))
                        ),
                        texttemplate: "%{text}",
                        textfont: {
                            color: "black",
                            size: 12,
                        },
                    },
                ]}
                layout={{
                    width: 700,
                    height: 700,
                    title: "Матрица корреляции",
                    xaxis: {
                        type: "category",
                    },
                    yaxis: {
                        type: "category",
                    },
                }}
            />
        </>
    )

}

export default PearsonHeatmap;