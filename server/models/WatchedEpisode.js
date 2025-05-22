import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js';
import { User } from './User.js';
import { Anime } from './Anime.js';
import { Episode } from './Episode.js';

export class WatchedEpisode extends Model {}

WatchedEpisode.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  animeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'animes', key: 'id' },
  },
  episodeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'episodes', key: 'id' },
  },
}, {
  sequelize: db,
  modelName: 'watchedepisode',
  indexes: [{ unique: true, fields: ['userId', 'episodeId'] }]
});

WatchedEpisode.belongsTo(User, { foreignKey: 'userId' });
WatchedEpisode.belongsTo(Anime, { foreignKey: 'animeId' });
WatchedEpisode.belongsTo(Episode, { foreignKey: 'episodeId' });

User.hasMany(WatchedEpisode, { foreignKey: 'userId' });
Anime.hasMany(WatchedEpisode, { foreignKey: 'animeId' });
Episode.hasMany(WatchedEpisode, { foreignKey: 'episodeId' });