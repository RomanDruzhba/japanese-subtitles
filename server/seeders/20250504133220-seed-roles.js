export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('roles', [
    {
      name: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('roles', null, {});
}
