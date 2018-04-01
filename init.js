var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('MoonToday');
db.run(`CREATE TABLE wallet (userid TEXT,
                             pair TEXT, 
                             amount NUMBER DEFAULT 0,
                             price NUMBER DEFAULT 0,
                             custom BOOL,
                             UNIQUE (userid, pair))`);
db.close();
