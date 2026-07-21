"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `ALTER TABLE manga 
MODIFY status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
;`,
        { transaction: t },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        ` ALTER TABLE users,

        DROP table manga;`,
        { transaction: t },
      );
    });
  },
};
