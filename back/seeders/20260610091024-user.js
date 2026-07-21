'use strict';

import bcrypt from 'bcrypt';

export default {
  async up(queryInterface) {

    const users = [];

    for (let i = 1; i <= 50; i++) {
      users.push({
        username: `user${i}`,
        email: `user${i}@test.com`,
        password: await bcrypt.hash('password', 10),
        role: 'VIEWER',
        created_at: new Date()
      });
    }

    await queryInterface.bulkInsert('users', users);

    const [dbUsers] = await queryInterface.sequelize.query(
      `SELECT id FROM users`
    );

    const mangaIds = [
      "a1c7c817-4e59-43b7-9365-09675a149a6f", // One piece
      "304ceac3-8cdb-4fe7-acf7-2b6ff7a60613", // attack on titan
      "6b1eb93e-473a-4ab3-9922-1a66d2a29a4aa", // Naruto
      "a460ab18-22c1-47eb-a08a-9ee85fe37ec8", // Bleach
      "c52b2ce3-7f95-469c-96b0-479524fb7a1a", // Jujutsu Kaisen
      "789642f8-ca89-4e4e-8f7b-eee4d17ea08b", // Demon Slayer
      "4f3bcae4-2d96-4c9d-932c-90181d9c873e", // My Hero Academia
      "6a1d1cb1-ecd5-40d9-89ff-9d88e40b136b", // Tokyo Ghoul
      "f7888782-0727-49b0-95ec-a3530c70f83b"  // Hajime no Ippo
    ];
    const chapterIds = Array.from({ length: 50 }, (_, i) => `chapter_${i + 1}`);

    // RATINGS
    const ratings = dbUsers.map(user => ({
      user_id: user.id,
      mangadex_id: mangaIds[Math.floor(Math.random() * mangaIds.length)],
      rating: Math.floor(Math.random() * 10) + 1
    }));

    await queryInterface.bulkInsert('ratings', ratings);

    // COMMENTS
    const comments = dbUsers.map(user => ({
      user_id: user.id,
      mangadex_id: mangaIds[Math.floor(Math.random() * mangaIds.length)],
      mangadex_chapter_id: null,
      content: `Commentaire user ${user.id}`,
      created_at: new Date()
    }));

    await queryInterface.bulkInsert('comments', comments);

    // LIKES
    const likes = dbUsers.map(user => ({
      user_id: user.id,
      mangadex_chapter_id: chapterIds[Math.floor(Math.random() * chapterIds.length)]
    }));

    await queryInterface.bulkInsert('likes', likes);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('likes', null, {});
    await queryInterface.bulkDelete('comments', null, {});
    await queryInterface.bulkDelete('ratings', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
