export async function up(queryInterface, Sequelize) {
  // 1. Добавляем новые столбцы
  await queryInterface.addColumn('watchedepisodes', 'animeId', {
    type: Sequelize.INTEGER,
    allowNull: true, // временно allowNull, чтобы можно было мигрировать данные
    references: { model: 'animes', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });

  await queryInterface.addColumn('watchedepisodes', 'episodeId', {
    type: Sequelize.INTEGER,
    allowNull: true, // временно
    references: { model: 'episodes', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });

  // 2. Мигрируем данные: находим animeId и episodeId по названиям
  const [watched] = await queryInterface.sequelize.query(`
    SELECT id, "animeTitle", "episodeTitle" FROM watchedepisodes
  `);

  for (const entry of watched) {
    const [[anime]] = await queryInterface.sequelize.query(
      `SELECT id FROM animes WHERE title = ? LIMIT 1`, {
        replacements: [entry.animeTitle],
      }
    );

    const [[episode]] = await queryInterface.sequelize.query(
      `SELECT id FROM episodes WHERE title = ? LIMIT 1`, {
        replacements: [entry.episodeTitle],
      }
    );

    if (anime && episode) {
      await queryInterface.sequelize.query(
        `UPDATE watchedepisodes SET "animeId" = ?, "episodeId" = ? WHERE id = ?`, {
          replacements: [anime.id, episode.id, entry.id],
        }
      );
    }
  }

  // 3. Теперь делаем поля NOT NULL
  await queryInterface.changeColumn('watchedepisodes', 'animeId', {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: 'animes', key: 'id' },
  });

  await queryInterface.changeColumn('watchedepisodes', 'episodeId', {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: 'episodes', key: 'id' },
  });

  // 4. Удаляем старые столбцы
  await queryInterface.removeColumn('watchedepisodes', 'animeTitle');
  await queryInterface.removeColumn('watchedepisodes', 'episodeTitle');
}

export async function down(queryInterface, Sequelize) {
  // 1. Добавляем старые поля обратно
  await queryInterface.addColumn('watchedepisodes', 'animeTitle', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn('watchedepisodes', 'episodeTitle', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  // 2. Мигрируем данные обратно
  const [watched] = await queryInterface.sequelize.query(`
    SELECT id, "animeId", "episodeId" FROM watchedepisodes
  `);

  for (const entry of watched) {
    const [[anime]] = await queryInterface.sequelize.query(
      `SELECT title FROM animes WHERE id = ? LIMIT 1`, {
        replacements: [entry.animeId],
      }
    );

    const [[episode]] = await queryInterface.sequelize.query(
      `SELECT title FROM episodes WHERE id = ? LIMIT 1`, {
        replacements: [entry.episodeId],
      }
    );

    await queryInterface.sequelize.query(
      `UPDATE watchedepisodes SET "animeTitle" = ?, "episodeTitle" = ? WHERE id = ?`, {
        replacements: [
          anime?.title || null,
          episode?.title || null,
          entry.id,
        ],
      }
    );
  }

  // 3. Удаляем новые поля
  await queryInterface.removeColumn('watchedepisodes', 'animeId');
  await queryInterface.removeColumn('watchedepisodes', 'episodeId');
}