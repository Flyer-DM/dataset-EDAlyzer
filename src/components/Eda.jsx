import { useState, useRef, useCallback, useEffect } from "react";
import EdaButton from './UI/button/EdaButton'
import EdaTable from './UI/table/EdaTable';
import valueCounts from './features/ValueCounts'
import NumberDescriptionWrapper from './features/NumberDescriptionWrapper'
import NumberCorrelationHeatmap from './features/NumberCorrelation'
import '../styles/Eda.css'
import trashCan from '../assets/trash-can.svg'


export default function Eda({ data }) {

    const [tableTitle, setTitle] = useState("");
    const [tableDescription, setDescription] = useState("");

    const [loading, setLoading] = useState(null);  // индикатор загрузки
    const [progress, setProgress] = useState(0);  // прогресс бар загрузки

    const [cache, setCache] = useState({});  // кеш вычисленных табличных значений
    const dataRef = useRef({ columns: [], values: [] });
    const [renderedData, setRenderedData] = useState({ columns: [], values: [] });
    const [customComponent, setCustomComponent] = useState(null);

    const resetEdaState = useCallback(() => {
        setRenderedData({ columns: [], values: [] });
        setCache({});
        setTitle("");
        setDescription("");
        setCustomComponent(null);
    }, []);

    useEffect(() => {
        resetEdaState();
    }, [data, resetEdaState]);


    const handleEdaAction = async (key, computeFn, title, description) => {
        setTitle(title);
        setDescription(description);
        setRenderedData({ columns: [], values: [] }); // очищаем UI перед загрузкой
        setLoading(true);
        setCustomComponent(null);

        if (cache[key]) {
            dataRef.current = cache[key];
            setRenderedData(cache[key]);
            setLoading(false);
            return;
        }

        const result = await computeFn();
        setCache(prev => ({ ...prev, [key]: result }));
        dataRef.current = result;
        setRenderedData(result);
        setLoading(false);
    };

    const handleNullClick = () => {
        handleEdaAction('null', () => {
            const nullCounts = data.columns.map(col => data[col].isNa().sum());
            return { columns: data.columns, values: [nullCounts] };
        },
            "Количество пропусков", "Суммарное количество отсутствующих данных");
    };

    const handleUniqueClick = () => {
        handleEdaAction('unique', () => {
            const uniqueCounts = data.columns.map(col => data[col].unique().size);
            return { columns: data.columns, values: [uniqueCounts] };
        },
            "Количество уникальных значений", "Размер множества неповторяемых значений");
    };

    const handleValueCountsClick = () => {
        setProgress(0);
        handleEdaAction('value counts', () => {
            const valueCountsValues = valueCounts(data.values, data.columns);
            return { columns: data.columns, values: [valueCountsValues] };
        },
            "Частота встречаемости значений", "Количество раз встречаемости каждого уникального значения");
    };

    const handleDescriptionClick = async () => {
        handleEdaAction('describe', async () => {
            const describeDf = await NumberDescriptionWrapper(data.values, data.columns, setProgress);
            return { columns: describeDf.columns, values: describeDf.values };
        },
            "Описательная статистика", "Статистика числовых данных (без учёта пропущенных значений)");
    };

    const handleCorrelationClick = () => {
        setTitle("Корреляция признаков");
        setDescription("Матрица корреляции Пирсона между числовыми признаками. +1 — идеальная положительная корреляция: при увеличении одной переменной другая также растёт. -1 — идеальная отрицательная корреляция: при увеличении одной переменной другая уменьшается. 0 — отсутствие линейной корреляции.");

        setRenderedData({ columns: [], values: [] });
        setLoading(false);
        setCustomComponent(<NumberCorrelationHeatmap df={data} />);
    };

    return (
        <div className="eda-wrapper">
            <div className="eda-block">
                <img src={trashCan} className="trash-can" alt="del" onClick={resetEdaState} />
                <ul className="eda-section">
                    <EdaButton onClick={handleNullClick} descr="Показать количество пропущенных значений">null</EdaButton>
                    <EdaButton onClick={handleUniqueClick} descr="Показать количество уникальных значений">unique</EdaButton>
                    <EdaButton onClick={handleValueCountsClick} descr="Показать частоту встречаемости значений">value counts</EdaButton>
                </ul>
                <ul className="eda-section">
                    <EdaButton onClick={handleDescriptionClick} descr="Описательная статистика числовых данных">describe</EdaButton>
                    <EdaButton onClick={handleCorrelationClick} descr="Корреляция числовых данных">correlation</EdaButton>
                </ul>
            </div>

            {loading && (
                <div className="loader">
                    Загрузка... {progress}%
                    <progress value={progress} max="100" />
                </div>
            )}

            {(renderedData.values && renderedData.values.length > 0 && !loading || customComponent !== null) && (
                <div className="eda-descr-container">
                    <h1 className="eda-main-text">{tableTitle}</h1>
                    <span className="eda-subtitle-text">{tableDescription}</span>
                </div>
            )}

            {renderedData.values && renderedData.values.length > 0 && !loading && (
                <EdaTable columns={renderedData.columns} values={renderedData.values} />
            )}

            {customComponent !== null && customComponent}
        </div>
    );
}