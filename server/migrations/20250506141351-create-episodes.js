export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('episodes', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    poster: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    rating: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    archived: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    animeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'animes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('episodes');
}
