import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js';
import { User } from './User.js';
import { Episode } from './Episode.js';

export class EpisodeRating extends Model {}

EpisodeRating.init({
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { sequelize: db, modelName: 'episodeRating' });

EpisodeRating.belongsTo(User, { foreignKey: 'userId' });
EpisodeRating.belongsTo(Episode, { foreignKey: 'episodeId' });
User.hasMany(EpisodeRating, { foreignKey: 'userId' });
Episode.hasMany(EpisodeRating, { foreignKey: 'episodeId' });
