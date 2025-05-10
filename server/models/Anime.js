import { DataTypes, Model } from 'sequelize';
import Sequelize from 'sequelize';
import { db } from '../db.js';
import { Genre } from './Genre.js';
import { Tag } from './Tag.js';

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
    type: DataTypes.BLOB,
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  released: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  finished: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  posterMimeType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { sequelize: db, modelName: 'anime' });


Anime.belongsToMany(Genre, { through: 'AnimeGenres' });
Genre.belongsToMany(Anime, { through: 'AnimeGenres' });

Anime.belongsToMany(Tag, { through: 'AnimeTags' });
Tag.belongsToMany(Anime, { through: 'AnimeTags' });
