// server/models/User.js

import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js'; // подключаем db
import { Role } from './Role.js';

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
  avatar: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  avatarMimeType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isBanned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  unbanDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  warningCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, { sequelize: db, modelName: 'user' });


User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });