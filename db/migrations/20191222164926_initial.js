
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('first_name')
      table.string('last_name')
      table.string('email')
      table.string('password')
      table.string('description')
      table.string('photo')
    }),

    knex.schema.createTable('dogs', (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned();
      table.foreign('user_id').onDelete('CASCADE').references('users.id');
      table.string('name')
      table.string('sex')
      table.string('breed')
      table.string('size')
      table.string('age')
      table.boolean('fixed')
      table.boolean('vaccinated')
      table.boolean('good_with_kids')
    }),

    knex.schema.createTable('dog_images', (table) => {
      table.increments('id').primary()
      table.integer('dog_id').unsigned();
      table.foreign('dog_id').onDelete('CASCADE').references('dogs.id')
      table.string('image_url')
    }),

    knex.schema.createTable('messages', (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned()
      table.foreign('user_id').onDelete('CASCADE').references('users.id')
      table.string('content')
    }),

    knex.schema.createTable('reports', (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned()
      table.foreign('user_id').onDelete('CASCADE').references('users.id')
      table.string('description')
    })
  ])
  
};

exports.down = function(knex) {
  
};
