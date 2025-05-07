export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('animes', 'description', {
    type: Sequelize.TEXT,
    allowNull: true,
  });

  await queryInterface.addColumn('animes', 'poster', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn('animes', 'rating', {
    type: Sequelize.FLOAT,
    defaultValue: 0,
    allowNull: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('animes', 'description');
  await queryInterface.removeColumn('animes', 'poster');
  await queryInterface.removeColumn('animes', 'rating');
}