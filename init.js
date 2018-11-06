var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('MoonToday.db');
db.run(`CREATE TABLE IF NOT EXISTS user   (userid TEXT)`);
db.run(`CREATE TABLE IF NOT EXISTS wallet (userid TEXT,
                                   pair TEXT, 
                                   amount NUMBER DEFAULT 0,
                                   price NUMBER DEFAULT 0,
                                   custom BOOL,
                                   UNIQUE (userid, pair))`);
db.close();
