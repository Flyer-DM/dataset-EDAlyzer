import { useState, useCallback, useEffect } from "react";
import EdaButton from './UI/button/EdaButton'
import EdaTable from './UI/table/EdaTable';
import valueCounts from './features/ValueCounts'
import '../styles/Eda.css'

import trashCan from '../assets/trash-can.svg'


export default function Eda({ data }) {

    const [columns, setColumns] = useState([]);
    const [values, setValues] = useState([]);
    const [tableTitle, setTitle] = useState("");
    const [tableDescription, setDescription] = useState("");
    const [cache, setCache] = useState({});  // кеш вычисленных табличных значений

    const resetEdaState = useCallback(() => {
        setColumns([]);
        setValues([]);
        setCache({});
        setTitle("");
        setDescription("");
    }, []);

    useEffect(() => {
        resetEdaState();
    }, [data, resetEdaState]);


    const handleEdaAction = (key, computeFn, title, description) => {
        setTitle(title);
        setDescription(description);
        if (cache[key]) {
            setColumns(cache[key].columns);
            setValues(cache[key].values);
            return;
        }

        const result = computeFn();
        setCache(prev => ({ ...prev, [key]: result }));
        setColumns(result.columns);
        setValues(result.values);
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
            const valueCountsValues = valueCounts(data.values, data.columns);;
            return { columns: data.columns, values: [valueCountsValues] };
        },
            "Частота встречаемости значений", "Количество раз встречаемости каждого уникального значения");
    };

    return (
        <div className="eda-wrapper">
            <ul className="eda-block">
                <img src={trashCan} className="trash-can" alt="del" onClick={resetEdaState}></img>
                <EdaButton onClick={handleNullClick} descr="Показать количество пропущенных значений">null</EdaButton>
                <EdaButton onClick={handleUniqueClick} descr="Показать количество уникальных значений">unique</EdaButton>
                <EdaButton onClick={handleValueCountsClick} descr="Показать частоту встречаемости значений">value counts</EdaButton>
            </ul>
            {values.length > 0 && (
                <>
                    <div className="eda-descr-container">
                        <h1 className="eda-main-text">{tableTitle}</h1>
                        <span className="eda-subtitle-text">{tableDescription}</span>
                    </div>
                    <EdaTable columns={columns} values={values} />
                </>
            )}
        </div>
    )
}