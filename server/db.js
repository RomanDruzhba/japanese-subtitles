// import { Sequelize } from 'sequelize';

// // Создаём подключение к SQLite базе
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: './database.sqlite', // файл базы данных будет рядом с сервером
//   logging: false, // можно убрать логирование SQL-запросов в консоль
// });

// // Экспортируем подключение, чтобы использовать в моделях
// export default sequelize;

// server/db.js

import { Sequelize } from 'sequelize';

export const db = new Sequelize({
  dialect: 'sqlite',
  storage: './server/database.sqlite',
  logging: false,
});