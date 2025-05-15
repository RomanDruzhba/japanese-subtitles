export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'isBanned', {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  });

  await queryInterface.addColumn('users', 'unbanDate', {
    type: Sequelize.DATE,
    allowNull: true,
  });

  await queryInterface.addColumn('users', 'warningCount', {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'isBanned');
  await queryInterface.removeColumn('users', 'unbanDate');
  await queryInterface.removeColumn('users', 'warningCount');
}