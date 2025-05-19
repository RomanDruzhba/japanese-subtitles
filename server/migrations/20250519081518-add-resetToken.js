export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'resetToken', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn('users', 'resetTokenExpires', {
    type: Sequelize.DATE,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('episodes', 'poster');
  await queryInterface.removeColumn('episodes', 'posterMimeType');
}

