export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'avatarUrl');
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'avatarUrl', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}