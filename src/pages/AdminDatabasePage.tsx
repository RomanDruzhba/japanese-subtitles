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

  const renderCell = (col: string, row: any, rowIndex: number) => {
    const value = row[col];

    // Обработка изображений (poster, avatar, др.)
    if (['poster', 'avatar'].includes(col)) {
      const isImage = typeof value === 'string' && value.startsWith('data:');

      return (
        <div className="flex flex-col items-center">
          {isImage && (
            <img
              src={value}
              alt={col}
              className={col === 'poster' ? 'w-24 h-36 object-cover mb-1' : 'w-12 h-12 rounded-full object-cover mb-1'}
            />
          )}
          {isImage && (
            <button
              onClick={() => {
                handleCellChange(rowIndex, col, '');
                saveRow({ ...row, [col]: '' });
              }}
              className="text-red-500 text-xs hover:underline"
            >
            Удалить
            </button>
          )}
        </div>
      );
    }

    // Выпадающий список для roleId
    if (col === 'roleId') {
      return (
        <select
          className="border rounded p-1"
          value={value || ''}
          onChange={(e) => {
            const newVal = Number(e.target.value);
            handleCellChange(rowIndex, col, newVal);
          }}
        >
          <option value="">--</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      );
    }

    // По умолчанию — текстовое поле
    return (
      <input
        className="border rounded px-2 py-1 w-full"
        value={value ?? ''}
        onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
      />
    );
  };

  const saveRow = (row: any) => {
    fetch(`/api/db/table/${selectedTable}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    }).then(() => loadTableData(selectedTable));
    console.log('poster type:', typeof row.poster, row.poster?.slice(0, 50));
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

  

  const renderNewRowCell = (col: string) => {
    if (col === 'roleId') {
      return (
        <select
          className="border rounded p-1"
          value={newRow[col] || ''}
          onChange={(e) => {
            const value = Number(e.target.value);
            setNewRow({ ...newRow, [col]: value });
          }}
        >
          <option value="">--</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      );
    }
    if (col === 'poster') {
      return (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onloadend = () => {
              setNewRow({ ...newRow, [col]: reader.result as string });
            };
            reader.readAsDataURL(file); // base64 строка
          }}
        />
      );
    }

    return (
      <input
        className="border rounded px-2 py-1 w-full"
        value={newRow[col] || ''}
        onChange={(e) => setNewRow({ ...newRow, [col]: e.target.value })}
      />
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Управление базой данных</h2>

      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium">Выберите таблицу:</label>
        <select
          className="border rounded px-2 py-1"
          value={selectedTable}
          onChange={(e) => loadTableData(e.target.value)}
        >
          <option value="">--</option>
          {tables.map((table) => (
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
      </div>

      {tableData && (
        <>
          {/* 🔍 Фильтрация */}
          <div className="mb-4 flex items-center gap-2">
            <label className="font-medium">Фильтр по:</label>
            <select
              className="border rounded px-2 py-1"
              value={filterColumn}
              onChange={(e) => {
                setFilterColumn(e.target.value);
                setFilterValue('');
              }}
            >
              <option value="">--</option>
              {tableData.columns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>

            {filterColumn && (
              <>
                <label className="font-medium">Значение:</label>
                <select
                  className="border rounded px-2 py-1"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="">--</option>
                  {[...new Set(tableData.rows.map(row => row[filterColumn]))]
                    .filter(v => v !== null && v !== undefined)
                    .map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                </select>
                <button
                  className="bg-gray-200 hover:bg-gray-300 rounded px-2 py-1"
                  onClick={() => {
                    setFilterColumn('');
                    setFilterValue('');
                  }}
                >
                  Сбросить
                </button>
              </>
            )}
          </div>

          {/* 📋 Таблица */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {tableData.columns.map((col) => (
                    <th key={col} className="border px-2 py-1">{col}</th>
                  ))}
                  <th className="border px-2 py-1">Действия</th>
                </tr>
              </thead>
              <tbody>
                {tableData.rows
                  .filter(row => {
                    if (!filterColumn || !filterValue) return true;
                    return String(row[filterColumn]) === filterValue;
                  })
                  .map((row, rowIndex) => (
                    <tr key={row.id || rowIndex} className="even:bg-gray-50">
                      {tableData.columns.map(col => (
                        <td key={col} className="border px-2 py-1">
                          {renderCell(col, row, rowIndex)}
                        </td>
                      ))}
                      <td className="border px-2 py-1 whitespace-nowrap">
                        <button
                          className="text-green-600 hover:underline mr-2"
                          onClick={() => saveRow(row)}
                        >
                          💾 Сохранить
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => deleteRow(row.id)}
                        >
                          🗑 Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                {/* Новая строка */}
                <tr className="bg-green-50">
                  {tableData.columns.map(col => (
                    <td key={col} className="border px-2 py-1">
                      {renderNewRowCell(col)}
                    </td>
                  ))}
                  <td className="border px-2 py-1 text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1"
                      onClick={addRow}
                    >
                      ➕ Добавить
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDatabasePage;
