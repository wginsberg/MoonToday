const Knex = require('knex');

const configs = {
    postgres : {
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DATABASE,
      port: process.env.SQL_PORT
    },
    sqlite3 : {
        filename: 'MoonToday.db'
    }
}

const production = process.env.NODE_ENV = 'prodcution'
const client = production || proces.argv[3] == '--cloud-sql' ? 'postgres' : 'sqlite3'
const config = configs[client]

if (production) {
    config.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

const knex = Knex({
    client: client,
    connection: config
});

knex.schema.hasTable('users')
    .then(function(exists) {
      if (!exists) {
        return knex.schema.createTable('users', function(t) {
          t.text('userid');
        }).createTable('wallet', (t) => {
            t.text('userid');
            t.text('pair');
            t.decimal('amount').defaultTo(0);
            t.decimal('price').defaultTo(0);
            t.boolean('custom');
            t.unique(['userid', 'pair']);
        });
      }
    })
    .then(knex.destroy)
    
