var dbconfig = require('./dbconfig');
var knex = require('knex') ({
  client: 'mysql',
  connection: {
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database
  },
  pool: {
    min: 0,
    max: 8
  }
});

knex.schema.createTableIfNotExists('users', function (user) {
  user.increments('id').primary();
  user.string('username').unique();
  user.string('password').unique();
  user.string('fullname');
  user.string('bio');
  user.string('location');
  user.string('imgurl');
  user.integer('online');
  user.integer('isTutor');
  user.integer('isStudent');
  user.integer('javascript');
  user.integer('ruby');
  user.integer('python');
  // for all integer, 0: false, 1: true
}).then(function() {
  console.log('users table created');
});

knex.schema.createTableIfNotExists('studentutor', function(join) {
  join.increments('ID').primary();
  join.integer('sid').unsigned();
  join.integer('tid').unsigned();
  join.integer('status');
  // 0: favorited, but neither invited nor accepted, 1: invited, 2: accepted
  join.integer('fav');
  // 0: not favorited 1: favorited
  join.date('date');
  join.time('time');
  join.foreign('sid').references('id').inTable('users');
  join.foreign('tid').references('id').inTable('users');
}).then(function() {
 console.log('invited join table created');
});

knex.schema.createTableIfNotExists('reviews', function(join) {
  join.increments('ID').primary();
  join.integer('sid').unsigned();
  join.integer('tid').unsigned();
  join.varchar('review');
  join.integer('rating');
  join.foreign('sid').references('id').inTable('users');
  join.foreign('tid').references('id').inTable('users');
}).then(function() {
 console.log('reviews join table created');
});

module.exports = {
  knex: knex
};
