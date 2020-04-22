exports.up = function (knex, Promise) {
  return knex.schema.createTable('images', (image) => {
    image.increments();
    image.string('image');
    image.text('description');
    image.timestamps(true, true);

    image
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('images');
};
