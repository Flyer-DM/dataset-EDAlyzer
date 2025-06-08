import { Series, DataFrame } from "danfojs"


export default function NumberDescription(values, columns) {

    const dfIndex = ["количество", "среднее", "стандартное отклонение", "минимальное", "медиана", "максимальное", "дисперсия"];
    let result = {"Статистика": dfIndex};

    for (let i = 0; i < columns.length; i++) {
        let series = new Series(values.map(x => x[i]));
        if (series.$dtypes[0] !== "string") {
            series = series.describe();
            result[columns[i]] = series.values;
        }
    }
    result = new DataFrame(result);

    return result;
}