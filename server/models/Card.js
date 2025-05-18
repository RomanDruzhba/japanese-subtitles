import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js';
import { User } from './User.js';

export class Card extends Model {}

Card.init({
  word: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  translation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM('трудно', 'сложно', 'легко', 'снова'),
    allowNull: false,
  },
  nextAppearance: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  repetition: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  interval: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }, // дни
  efactor: {
    type: DataTypes.FLOAT,
    defaultValue: 2.5
  },
}, {
  sequelize: db,
  modelName: 'card',
});

Card.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Card, { foreignKey: 'userId' });
