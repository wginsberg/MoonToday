const local = process.argv[2] == "--local"

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

const client = local ? "sqlite3" : "postgres"
const config = configs[client]

if (!local) {
    if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
        config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
    }
}

const knex = Knex({
    client: client,
    connection: config
});

knex.schema.hasTable('user')
    .then(function(exists) {
      if (!exists) {
        return knex.schema.createTable('user', function(t) {
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
    
