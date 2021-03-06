
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
      table.index(['user_id'])
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
      table.index(['user_id'])
    }),

    knex.schema.createTable('reports', (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned()
      table.foreign('user_id').onDelete('CASCADE').references('users.id')
      table.string('description')
    }),

    knex.schema.createTable('swipes', (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned()
      table.foreign('user_id').onDelete('CASCADE').references('users.id')
      table.integer('shown_user_id').unsigned()
      table.foreign('shown_user_id').onDelete('CASCADE').references('users.id')
      table.index(['shown_user_id'])
      table.boolean('liked')
    })
  ])
  
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('dog_images'),
    knex.schema.dropTable('dogs'),
    knex.schema.dropTable('swipes'),
    knex.schema.dropTable('reports'),
    knex.schema.dropTable('messages'),
    knex.schema.dropTable('users')
  ])
};
