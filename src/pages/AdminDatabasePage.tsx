import React, { useEffect, useState } from 'react';

interface TableData {
  name: string;
  columns: string[];
  rows: any[];
}

interface Role {
  id: number;
  name: string;
}

const AdminDatabasePage: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [newRow, setNewRow] = useState<{ [key: string]: string | number }>({});
  const [roles, setRoles] = useState<Role[]>([]);
  const [filterColumn, setFilterColumn] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    fetch('/api/db/tables')
      .then(res => res.json())
      .then(setTables)
      .catch(err => console.error('Ошибка загрузки таблиц', err));

    fetch('/api/db/roles')
      .then(res => res.json())
      .then(setRoles)
      .catch(err => console.error('Ошибка загрузки ролей', err));
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

  const handleCellChange = (rowIndex: number, column: string, value: string | number) => {
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

  const renderCell = (col: string, row: any, rowIndex: number) => {
    

    if (col === 'avatar' && typeof row[col] === 'string' && row[col].startsWith('data:')) {
      return <img src={row[col]} alt="avatar" style={{ maxWidth: '50px', maxHeight: '50px' }} />;
    }

    if (col === 'roleId') {
      return (
        <select
          value={row[col] || ''}
          onChange={(e) => {
            const value = col === 'roleId' ? Number(e.target.value) : e.target.value;
            handleCellChange(rowIndex, col, value);
          }}
        >
          <option value="">--</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        value={row[col] ?? ''}
        onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
      />
    );
  };

  const renderNewRowCell = (col: string) => {
    

    if (col === 'roleId') {
      return (
        <select
          value={newRow[col] || ''}
          onChange={(e) => {
            const value = col === 'roleId' ? Number(e.target.value) : e.target.value;
            setNewRow({ ...newRow, [col]: value });
          }}
        >
          <option value="">--</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        value={newRow[col] || ''}
        onChange={(e) => setNewRow({ ...newRow, [col]: e.target.value })}
      />
    );
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
        <>
          {/* 🔍 Блок фильтрации */}
          <div style={{ marginBottom: '1rem' }}>
            <label>Фильтр по столбцу: </label>
            <select
              value={filterColumn}
              onChange={(e) => {
                setFilterColumn(e.target.value);
                setFilterValue(''); // сброс значения при смене столбца
              }}
            >
              <option value="">--</option>
              {tableData.columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>

            {filterColumn && (
              <>
                &nbsp;
                <label>Значение: </label>
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="">--</option>
                  {[...new Set(tableData.rows.map((row) => row[filterColumn]))]
                    .filter((val) => val !== null && val !== undefined)
                    .map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                </select>
                &nbsp;
                <button onClick={() => {
                  setFilterColumn('');
                  setFilterValue('');
                }}>Сбросить фильтр</button>
              </>
            )}
          </div>

          {/* 📋 Таблица */}
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
              {tableData.rows
                .filter((row) => {
                  if (!filterColumn || !filterValue) return true;
                  return String(row[filterColumn]) === filterValue;
                })
                .map((row, rowIndex) => (
                  <tr key={row.id || rowIndex}>
                    {tableData.columns.map((col) => (
                      <td key={col}>{renderCell(col, row, rowIndex)}</td>
                    ))}
                    <td>
                      <button onClick={() => saveRow(row)}>💾 Сохранить</button>{' '}
                      <button onClick={() => deleteRow(row.id)}>🗑 Удалить</button>
                    </td>
                  </tr>
                ))}
              {/* ➕ Добавление новой строки */}
              <tr>
                {tableData.columns.map((col) => (
                  <td key={col}>{renderNewRowCell(col)}</td>
                ))}
                <td>
                  <button onClick={addRow}>➕ Добавить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminDatabasePage;
