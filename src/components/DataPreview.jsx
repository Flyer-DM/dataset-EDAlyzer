import { useState } from "react";
import countDuplicateRows from './features/CountDuplicateRows'
import MyInput from './UI/input/MyInput'
import EdaTable from './UI/table/EdaTable'
import ChangeArrows from "../assets/changeArrows";
import '../styles/DataPreview.css';


function PreviewTable({ columns, values, dtypes }) {
    const maxRows = 5;

    const totalRows = values.length;
    const headRows = values.slice(0, maxRows);
    const tailRows = values.slice(-maxRows);

    const [flipped, setFlipped] = useState(false);
    const [copiedCell, setCopiedCell] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (query) => {
        setSearchQuery(query);

        if (!query) {
            setSearchResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = [];

        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < columns.length; j++) {
                const cell = String(values[i][j]).toLowerCase();
                if (cell.includes(lowerQuery)) {
                    results.push(values[i]);
                    break;
                }
            }
            if (results.length >= 5) break;
        }

        setSearchResults(results);
    };

    { / обработка копирования в буфер обмена при нажатии на ячейку/ }
    const handleCopy = async (text, rowIdx, colIdx) => {
        await navigator.clipboard.writeText(text);
        setCopiedCell({ row: rowIdx, col: colIdx });
        setTimeout(() => setCopiedCell(null), 1000);
    };

    const getColumns = () => (flipped ? [...columns].reverse() : columns);
    const getDtypes = () => (flipped ? [...dtypes].reverse() : dtypes);
    const getValues = (data) => data.map(row => (flipped ? [...row].reverse() : row));

    const renderColumn = (col, i) => (
        <th key={i}>
            <div>{col}</div>
            <div style={{ color: 'green', fontSize: '0.8em' }}>{getDtypes()[i]}</div>
        </th>
    );

    const renderRow = (row, rowIndexOffset) =>
        row.map((cell, j) => {
            const isCopied = copiedCell?.row === rowIndexOffset && copiedCell?.col === j;
            return (
                <td
                    key={j}
                    className="copy-cell"
                    onClick={() => handleCopy(cell, rowIndexOffset, j)}
                >
                    {cell}
                    {isCopied && <span className="copied-popup">Скопировано</span>}
                </td>
            );
        });

    return (
        <>
            <div className="action-bar">
                <ul className="action-bar-right">
                    <ChangeArrows onClick={() => setFlipped(!flipped)} />
                </ul>
                <ul className="action-bar-left">
                    <li>
                        <form>
                            <label>
                                <MyInput type="text" placeholder="Поиск..." onChange={(e) => handleSearch(e.target.value)} value={searchQuery} />
                            </label>
                        </form>
                    </li>
                    <li title="полностью идентичные записи"><span>Дублей: </span><strong>{countDuplicateRows(values)}</strong></li>
                    <li><span>Столбцов: </span><strong>{columns.length}</strong></li>
                    <li><span>Строк: </span><strong>{totalRows}</strong></li>
                </ul>
            </div>
            {searchResults.length > 0 && (
                <div className="search-overlay" onClick={() => setSearchResults([])}>
                    <div
                        className="search-popup"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="popup-header">
                            <span>Результаты поиска:</span>
                            <button onClick={() => setSearchResults([])}>✖</button>
                        </div>
                        <EdaTable columns={columns} values={searchResults} />
                    </div>
                </div>
            )}
            <div className="table-scroll-container">
                <div className="smart-table">
                    <table>
                        <thead>
                            <tr>
                                {getColumns().map((col, i) => renderColumn(col, i))}
                            </tr>
                        </thead>
                        <tbody>
                            {totalRows <= 10 ? (
                                getValues(values).map((row, i) => (
                                    <tr key={`row-${i}`}>{renderRow(row, i)}</tr>
                                ))
                            ) : (
                                <>
                                    {getValues(headRows).map((row, i) => (
                                        <tr key={`head-${i}`}>{renderRow(row, i)}</tr>
                                    ))}
                                    {totalRows > maxRows * 2 && (
                                        <tr className="ellipsis">
                                            <td colSpan={columns.length}>
                                                ... {totalRows - maxRows * 2} строк скрыто ...
                                            </td>
                                        </tr>
                                    )}
                                    {getValues(tailRows).map((row, i) => (
                                        <tr key={`tail-${i}`}>{renderRow(row, totalRows - maxRows + i)}</tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default function DataPreview({ data }) {
    if (!data || data.shape[0] === 0) return <p>Нет данных</p>;

    const columns = data.columns;
    const dtypes = data.ctypes.$data;
    const values = data.values;

    return (
        <>
            <PreviewTable columns={columns} values={values} dtypes={dtypes} />
        </>
    )
}