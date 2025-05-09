export default (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
    });
  
    Tag.associate = (models) => {
      Tag.belongsToMany(models.Anime, {
        through: 'AnimeTags',
        foreignKey: 'tagId',
      });
    };
  
    return Tag;
  };