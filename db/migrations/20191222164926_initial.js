
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
    })
  ])
  
};

exports.down = function(knex) {
  
};
