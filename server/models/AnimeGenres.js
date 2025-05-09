export default (sequelize, DataTypes) => {
    const Genre = sequelize.define('Genre', {
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
    });
  
    Genre.associate = (models) => {
      Genre.belongsToMany(models.Anime, {
        through: 'AnimeGenres',
        foreignKey: 'genreId',
      });
    };
  
    return Genre;
  };