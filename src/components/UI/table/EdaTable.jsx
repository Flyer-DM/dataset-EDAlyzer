import { useState } from "react";
import '../../../styles/DataPreview.css';


export default function EdaTable({ columns, values }) {
    const [copiedCell, setCopiedCell] = useState(null);

    { / обработка копирования в буфер обмена при нажатии на ячейку/ }
    const handleCopy = async (text, rowIdx, colIdx) => {
        await navigator.clipboard.writeText(text);
        setCopiedCell({ row: rowIdx, col: colIdx });
        setTimeout(() => setCopiedCell(null), 1000);
    };

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
            <div className="eda-table-scroll-container">
                <div className="smart-table">
                    <table>
                        <thead>
                            <tr>{
                            columns.map((col, i) =>
                                <th key={i}>
                                    <div>{col}</div>
                                </th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {values.map((row, i) => (
                                <tr key={`head-${i}`}>{renderRow(row, i)}</tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}