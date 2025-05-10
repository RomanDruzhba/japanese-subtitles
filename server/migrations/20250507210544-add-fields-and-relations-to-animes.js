export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('animes', 'released', {
    type: Sequelize.STRING,
    allowNull: true,
  });
  
  await queryInterface.addColumn('animes', 'finished', {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  });
  
  // Жанры
  await queryInterface.createTable('genres', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  });
  
  // Тэги
  await queryInterface.createTable('tags', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  });
  
  // Промежуточные таблицы
  await queryInterface.createTable('AnimeGenres', {
    animeId: {
      type: Sequelize.INTEGER,
      references: { model: 'animes', key: 'id' },
      onDelete: 'CASCADE',
    },
    genreId: {
      type: Sequelize.INTEGER,
      references: { model: 'genres', key: 'id' },
      onDelete: 'CASCADE',
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  });
  
  await queryInterface.createTable('AnimeTags', {
    animeId: {
      type: Sequelize.INTEGER,
      references: { model: 'animes', key: 'id' },
      onDelete: 'CASCADE',
    },
    tagId: {
      type: Sequelize.INTEGER,
      references: { model: 'tags', key: 'id' },
      onDelete: 'CASCADE',
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  });
}
  
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('animes', 'released');
  await queryInterface.removeColumn('animes', 'finished');
  
  await queryInterface.dropTable('AnimeGenres');
  await queryInterface.dropTable('AnimeTags');
  await queryInterface.dropTable('genres');
  await queryInterface.dropTable('tags');
}