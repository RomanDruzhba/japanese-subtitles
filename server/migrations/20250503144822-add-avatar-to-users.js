export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'avatar', {
    type: Sequelize.BLOB,
    allowNull: true,
  });
  await queryInterface.addColumn('users', 'avatarMimeType', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'avatar');
  await queryInterface.removeColumn('users', 'avatarMimeType');
}