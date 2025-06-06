// server/models/Comment.js

import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js';
import { User } from './User.js'; // подключаем модель пользователя

export class Comment extends Model {}

Comment.init({
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  videoId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, { sequelize: db, modelName: 'comment' });

// Связь: комментарий принадлежит пользователю
Comment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });
