import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js';
import { Anime } from './Anime.js';

export class Episode extends Model {}

Episode.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  poster: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, { sequelize: db, modelName: 'episode' });

Episode.belongsTo(Anime, { foreignKey: 'animeId' });
Anime.hasMany(Episode, { foreignKey: 'animeId' });
