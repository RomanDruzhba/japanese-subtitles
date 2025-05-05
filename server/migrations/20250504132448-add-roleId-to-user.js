export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'roleId', {
    type: Sequelize.INTEGER,
    references: {
      model: 'roles',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'roleId');
}
