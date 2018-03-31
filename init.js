var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('MoonToday');
db.run(`CREATE TABLE wallet (userid TEXT,
                             pair TEXT UNIQUE, 
                             amount NUMBER,
                             price NUMBER,
                             custom BOOL)`);
db.close();
