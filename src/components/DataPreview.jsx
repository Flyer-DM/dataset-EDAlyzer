import { useState } from "react";
import '../styles/DataPreview.css';

function ChangeArrows({ onClick }) {
    return (
        <svg
            onClick={onClick}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ cursor: 'pointer', marginBottom: '10px' }}
        >
            <path fill="currentColor" d="M7 7V4l-5 5l5 5V9h10V7H7Zm10 10v3l5-5l-5-5v3H7v2h10Z" />
        </svg>
    );
}


function PreviewTable({ columns, values, dtypes }) {
    const maxRows = 5;

    const totalRows = values.length;
    const headRows = values.slice(0, maxRows);
    const tailRows = values.slice(-maxRows);

    const [flipped, setFlipped] = useState(false);
    const [copiedCell, setCopiedCell] = useState(null);

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
                    <li><span>Столбцов: </span><strong>{columns.length}</strong></li>
                    <li><span>Строк: </span><strong>{totalRows}</strong></li>
                </ul>
            </div>
            <div className="table-scroll-container">
                <div className="smart-table">
                    <table>
                        <thead>
                            <tr>
                                {getColumns().map((col, i) => renderColumn(col, i))}
                            </tr>
                        </thead>
                        <tbody>
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
                            {totalRows > maxRows &&
                                getValues(tailRows).map((row, i) => (
                                    <tr key={`tail-${i}`}>{renderRow(row, totalRows - maxRows + i)}</tr>
                                ))}
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