const bcrypt = require('bcryptjs');

exports.seed = function (knex, Promise) {
  return knex('users')
    .del()
    .then(function () {
      return knex('users')
        .insert([
          {
            username: 'pedro',
            password: bcrypt.hash('1234', 10),
          },
          {
            username: 'rogelio',
            password: bcrypt.hash('1234', 10),
          },
          {
            username: 'emir',
            password: bcrypt.hash('1234', 10),
          },
        ])
        .returning('*');
    });
};
