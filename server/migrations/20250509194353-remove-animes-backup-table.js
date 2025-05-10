export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('animes_backup');
  },


};