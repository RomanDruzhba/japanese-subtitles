import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js';
import { User } from './User.js';
import { Anime } from './Anime.js';

export class AnimeRating extends Model {}

AnimeRating.init({
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { sequelize: db, modelName: 'animeRating' });

AnimeRating.belongsTo(User, { foreignKey: 'userId' });
AnimeRating.belongsTo(Anime, { foreignKey: 'animeId' });
User.hasMany(AnimeRating, { foreignKey: 'userId' });
Anime.hasMany(AnimeRating, { foreignKey: 'animeId' });
