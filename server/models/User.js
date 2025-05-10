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
    type: DataTypes.BLOB('long'), // для хранения больших изображений
    allowNull: true,
  },
  avatarMimeType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { sequelize: db, modelName: 'user' });


User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });