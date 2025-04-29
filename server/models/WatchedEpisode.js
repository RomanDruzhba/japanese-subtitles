// server/models/WatchedEpisode.js

import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js';
import { User } from './User.js'; // подключаем модель пользователя

export class WatchedEpisode extends Model {}

WatchedEpisode.init({
  animeTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  episodeTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { sequelize: db, modelName: 'watchedepisode' });

// Связь: просмотренный эпизод принадлежит пользователю
WatchedEpisode.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(WatchedEpisode, { foreignKey: 'userId' });
