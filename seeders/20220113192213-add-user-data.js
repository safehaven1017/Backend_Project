'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
    username: "test",
    password: "$2b$10$7hs3GGgv6Uih1zpfAitDkOGX0I6qqJs2BEcpzR0yQQYxkLrCHcSlK",
    createdAt: new Date(),
    updatedAt: new Date()
      },
    ]);
  }
}
