var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('MoonToday');
db.run("CREATE TABLE wallet (pair TEXT, amount NUMBER)");
db.close();
