export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('cards', 'reading', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('cards', 'reading');
} 