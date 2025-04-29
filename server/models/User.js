// import { DataTypes } from 'sequelize';
// import sequelize from '../db';

// const User = sequelize.define('User', {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   email: { type: DataTypes.STRING, unique: true, allowNull: false },
//   password: { type: DataTypes.STRING, allowNull: false },
//   nickname: { type: DataTypes.STRING, allowNull: true },
//   avatarUrl: { type: DataTypes.STRING, allowNull: true },
// });

// export default User;


// server/models/User.js

import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js'; // подключаем db

export class User extends Model {}

// определяем таблицу пользователей
User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { sequelize: db, modelName: 'user' });
