const express = require('express')
const app = express()

/*
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('MoonToday');

var get_wallets = (req, res) => {
    db.each("SELECT * FROM wallet", 
        (err, row) => console.log(err || (row.pair + ": " + row.amount)))
};
*/

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

// Supply javascript to the client. Can this be cleaner?
app.get('/main.js', (req, res) => res.sendFile(__dirname + '/main.js'))
app.get('/wallets.js', (req, res) => res.sendFile(__dirname + '/wallets.js'))
app.get('/doughnutChart.js', (req, res) => res.sendFile(__dirname + '/doughnutChart.js'))
app.get('/insights.js', (req, res) => res.sendFile(__dirname + '/insights.js'))
app.get('/market.js', (req, res) => res.sendFile(__dirname + '/market.js'))

// Supply styles
app.get('/style.css', (req, res) => res.sendFile(__dirname + '/style.css'))
app.get('/graph_style.css', (req, res) => res.sendFile(__dirname + '/graph_style.css'))

// Supply images
app.get('/img/moon.gif', (req, res) => res.sendFile(__dirname + '/img/moon.gif'))
app.get('/img/rollercoaster.gif', (req, res) => res.sendFile(__dirname + '/img/rollercoaster.gif'))
app.get('/img/rollercoaster2.gif', (req, res) => res.sendFile(__dirname + '/img/rollercoaster2.gif'))
app.get('/img/ethereum.gif', (req, res) => res.sendFile(__dirname + '/img/ethereum.gif'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

//db.close();

