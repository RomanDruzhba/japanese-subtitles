import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js';

export class Genre extends Model {}

Genre.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, { sequelize: db, modelName: 'genre' });