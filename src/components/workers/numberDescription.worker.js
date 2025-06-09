import { Series, DataFrame } from "danfojs";

self.onmessage = function (e) {
    const { values, columns } = e.data;

    const dfIndex = ["количество", "среднее", "стандартное отклонение", "минимальное", "медиана", "максимальное", "дисперсия"];
    let result = { "Статистика": dfIndex };

    const total = columns.length;
    let processed = 0;

    for (let i = 0; i < total; i++) {
        let series = new Series(values.map(x => x[i]));
        if (series.$dtypes[0] !== "string") {
            series = series.describe();
            result[columns[i]] = series.values;
        }

        processed++;
        self.postMessage({
            type: "progress",
            progress: Math.round((processed / total) * 100)
        });
    }

    const df = new DataFrame(result);
    self.postMessage({
        type: "result",
        data: { columns: df.columns, values: df.values }
    });
};