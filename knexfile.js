require('dotenv');

module.exports = {
  development: {
    client: 'pg',
    connection:
      process.env.POSTGRES_CONNECTION_STRING ||
      'postgres://postgres:postgres@localhost:5432/NHC_dev',
    pool: {
      min: 0,
      max: 2,
      afterCreate: function (conn, done) {
        conn.query('SET timezone="UTC";', function (err) {
          done(err, conn);
        });
      },
    },
    migrations: {
      directory: './data/migrations',
      tableName: 'knex_migrations',
    },
    seeds: { directory: './data/seeds' },
  },

  staging: {
    client: 'pg',
    connection: process.env.POSTGRES_CONNECTION_STRING,
    pool: {
      min: 1,
      max: 4,
    },
    migrations: {
      directory: './data/migrations',
      tableName: 'knex_migrations',
    },
    seeds: { directory: './data/seeds' },
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.POSTGRES_CONNECTION_STRING,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 8,
    },
    migrations: {
      directory: './data/migrations',
      tableName: 'knex_migrations',
    },
    seeds: { directory: './data/seeds' },
  },
};
