import { useState, useRef, useCallback, useEffect } from "react";
import EdaButton from './UI/button/EdaButton'
import EdaTable from './UI/table/EdaTable';
import valueCounts from './features/ValueCounts'
import NumberDescription from './features/NumberDescription'
import '../styles/Eda.css'

import trashCan from '../assets/trash-can.svg'


export default function Eda({ data }) {

    const [tableTitle, setTitle] = useState("");
    const [tableDescription, setDescription] = useState("");
    const [cache, setCache] = useState({});  // кеш вычисленных табличных значений
    const [loading, setLoading] = useState(null);  // индикатор загрузки

    const dataRef = useRef({ columns: [], values: [] });
    const [renderedData, setRenderedData] = useState({ columns: [], values: [] });

    const resetEdaState = useCallback(() => {
        setRenderedData({ columns: [], values: [] });
        setCache({});
        setTitle("");
        setDescription("");
    }, []);

    useEffect(() => {
        resetEdaState();
    }, [data, resetEdaState]);


    const handleEdaAction = async (key, computeFn, title, description) => {
        setTitle(title);
        setDescription(description);
        setRenderedData({ columns: [], values: [] }); // очищаем UI перед загрузкой
        setLoading(true);

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
        handleEdaAction('value counts', () => {
            const valueCountsValues = valueCounts(data.values, data.columns);
            return { columns: data.columns, values: [valueCountsValues] };
        },
            "Частота встречаемости значений", "Количество раз встречаемости каждого уникального значения");
    };

    const handleDescriptionClick = () => {
        handleEdaAction('describe', () => {
            const describeDf = NumberDescription(data.values, data.columns);
            return { columns: describeDf.columns, values: describeDf.values };
        },
            "Описательная статистика", "Статистика числовых данных (без учёта пропущенных значений)");
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
                </ul>
            </div>

            {loading && <div className="loader">Загрузка...</div>}

            {renderedData.values.length > 0 && !loading && (
                <>
                    <div className="eda-descr-container">
                        <h1 className="eda-main-text">{tableTitle}</h1>
                        <span className="eda-subtitle-text">{tableDescription}</span>
                    </div>
                    <EdaTable columns={renderedData.columns} values={renderedData.values} />
                </>
            )}
        </div>
    );
}