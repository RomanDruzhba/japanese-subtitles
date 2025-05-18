export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('cards', 'repetition', {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  });

  await queryInterface.addColumn('cards', 'interval', {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    allowNull: false,
  });

  await queryInterface.addColumn('cards', 'efactor', {
    type: Sequelize.FLOAT,
    defaultValue: 2.5,
    allowNull: false,
  });

}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('cards', 'repetition');
  await queryInterface.removeColumn('cards', 'interval');
  await queryInterface.removeColumn('cards', 'efactor');
}