// export async function up(queryInterface, Sequelize) {
// await queryInterface.changeColumn('animes', 'poster', {
//   type: Sequelize.BLOB('long'),
//   allowNull: true,
// });
// }

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('animes', 'posterMimeType', {
    type: Sequelize.BLOB,
    allowNull: true,
  });
  await queryInterface.addColumn('episodes', 'posterMimeType', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}