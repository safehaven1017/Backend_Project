'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      score: {
        type: Sequelize.INTEGER
      },
      userFunRating: {
        type: Sequelize.INTEGER
      },
      answers: {
        type: Sequelize.JSONB
      },
      userPlayTime: {
        type: Sequelize.INTEGER
      },
      GameId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Games",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Histories');
  }
};