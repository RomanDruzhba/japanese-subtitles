import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js';

export class Role extends Model {}

Role.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize: db,
  modelName: 'role',
});
