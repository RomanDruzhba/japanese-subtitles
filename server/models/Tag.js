import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js';

export class Tag extends Model {}

Tag.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, { sequelize: db, modelName: 'tag' });