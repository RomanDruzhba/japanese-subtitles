export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('cards', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    word: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    translation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    difficulty: {
      type: Sequelize.ENUM('трудно', 'сложно', 'легко', 'снова'),
      allowNull: false,
    },
    nextAppearance: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('cards');
}
