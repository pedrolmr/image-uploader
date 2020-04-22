exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('images')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('images')
        .insert([
          { image: 'pedros image 1', description: 'idk1', user_id: 1 },
          { image: 'pedros image 2', description: 'idk2', user_id: 1 },

          { image: 'rogelios image 1', description: 'idk1', user_id: 2 },
          { image: 'rogelios image 2', description: 'idk2', user_id: 2 },

          { image: 'emirs image 1', description: 'idk1', user_id: 3 },
          { image: 'emirs image 2', description: 'idk2', user_id: 3 },
        ])
        .returning('*');
    });
};
