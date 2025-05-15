export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('complaints', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    complaintText: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    isResolved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    complainantId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    targetUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    commentId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'comments', key: 'id' },
      onDelete: 'SET NULL',
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('complaints');
}