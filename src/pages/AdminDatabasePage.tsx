import React, { useEffect, useState } from 'react';

interface TableData {
  name: string;
  columns: string[];
  rows: any[];
}

const AdminDatabasePage: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [newRow, setNewRow] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch('/api/db/tables')
      .then(res => res.json())
      .then(setTables)
      .catch(err => console.error('Ошибка загрузки таблиц', err));
  }, []);

  const loadTableData = (tableName: string) => {
    setSelectedTable(tableName);
    fetch(`/api/db/table/${tableName}`)
      .then(res => res.json())
      .then(data => {
        setTableData({ name: tableName, columns: data.columns, rows: data.rows });
        const initialRow: { [key: string]: string } = {};
        data.columns.forEach((col: string) => (initialRow[col] = ''));
        setNewRow(initialRow);
      });
  };

  const handleCellChange = (rowIndex: number, column: string, value: string) => {
    if (!tableData) return;
    const updatedRows = [...tableData.rows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [column]: value };
    setTableData({ ...tableData, rows: updatedRows });
  };

  const saveRow = (row: any) => {
    fetch(`/api/db/table/${selectedTable}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    }).then(() => loadTableData(selectedTable));
  };

  const deleteRow = (rowId: number) => {
    fetch(`/api/db/table/${selectedTable}/${rowId}`, {
      method: 'DELETE',
    }).then(() => loadTableData(selectedTable));
  };

  const addRow = () => {
    fetch(`/api/db/table/${selectedTable}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRow),
    }).then(() => loadTableData(selectedTable));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Управление базой данных</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Выберите таблицу:&nbsp;</label>
        <select value={selectedTable} onChange={(e) => loadTableData(e.target.value)}>
          <option value="">--</option>
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      {tableData && (
        <table border={1} cellPadding={5} cellSpacing={0} style={{ width: '100%' }}>
          <thead>
            <tr>
              {tableData.columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {tableData.columns.map((col) => (
                  <td key={col}>
                    <input
                      value={row[col] ?? ''}
                      onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                    />
                  </td>
                ))}
                <td>
                  <button onClick={() => saveRow(row)}>💾 Сохранить</button>{' '}
                  <button onClick={() => deleteRow(row.id)}>🗑 Удалить</button>
                </td>
              </tr>
            ))}
            <tr>
              {tableData.columns.map((col) => (
                <td key={col}>
                  <input
                    value={newRow[col] || ''}
                    onChange={(e) => setNewRow({ ...newRow, [col]: e.target.value })}
                  />
                </td>
              ))}
              <td>
                <button onClick={addRow}>➕ Добавить</button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDatabasePage;
