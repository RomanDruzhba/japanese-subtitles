import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js';

export class Anime extends Model {}

Anime.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
}, { sequelize: db, modelName: 'anime' });
