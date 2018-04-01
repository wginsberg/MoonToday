// Setup express
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.text());

// Setup sqlite
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('MoonToday');

var getWallets = (req, res) => {
    var query = 'SELECT * FROM wallet WHERE userid == ?'
    var params = [req.params.userid]
    var callback = (err, rows) => res.send(rows)
    db.all(query, params, callback)
};

var addWallet = (req, res) => {
    var query = "INSERT INTO wallet (userid, pair, custom) VALUES (?, ?, ?)"
    var params = [req.params.userid, req.params.name, Boolean(req.body.length)]
    var callback = (err) => {console.log(err); res.sendStatus(err ? 500 : 200)}
    db.run(query, params, callback)
}

var removePair = (req, res) => {
    var query = "DELETE FROM wallet WHERE pair == ? AND userid == ?"
    var params = [req.params.name, req.params.userid]
    var callback = (err) => res.sendStatus(err ? 500 : 200)
    db.run(query, params, callback)
}

var updateWallet = (req, res) => {
    var query = "UPDATE wallet SET amount = ? WHERE pair == ? AND userid == ?"
    var params = [req.body, req.params.name, req.params.userid]
    var callback = (err) => res.sendStatus(err ? 500 : 200)
    db.run(query, params, callback)
}

// TODO track the price history of custom pairs
var updatePair = (req, res) => {
    console.log(req.params)
    var query = "UPDATE wallet SET price = ? WHERE pair == ? and userid == ?"
    var params = [req.body, req.params.name, req.params.userid]
    var callback = (err) => res.sendStatus(err ? 500 : 200)
    db.run(query, params, callback)
}

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

// API
// `curl localhost:3000/wallets`
app.get('/wallets/:userid', getWallets)
// `curl -X PUT localhost:3000/wallets/DOGEBTC`
app.put('/wallets/:userid/:name', addWallet)

app.put('/wallets/:userid/:name/amount', updateWallet)
app.put('/wallets/:userid/:name/price', updatePair)
app.delete('/wallets/:userid/:name', removePair)

// Supply javascript to the client. Can this be cleaner?
app.get('/main.js', (req, res) => res.sendFile(__dirname + '/main.js'))
app.get('/wallets.js', (req, res) => res.sendFile(__dirname + '/wallets.js'))
app.get('/doughnutChart.js', (req, res) => res.sendFile(__dirname + '/doughnutChart.js'))
app.get('/insights.js', (req, res) => res.sendFile(__dirname + '/insights.js'))
app.get('/market.js', (req, res) => res.sendFile(__dirname + '/market.js'))
app.get('/cookie.js', (req, res) => res.sendFile(__dirname + '/cookie.js'))

// Supply styles
app.get('/style.css', (req, res) => res.sendFile(__dirname + '/style.css'))
app.get('/graph_style.css', (req, res) => res.sendFile(__dirname + '/graph_style.css'))

// Supply images
app.get('/img/moon.gif', (req, res) => res.sendFile(__dirname + '/img/moon.gif'))
app.get('/img/rollercoaster.gif', (req, res) => res.sendFile(__dirname + '/img/rollercoaster.gif'))
app.get('/img/rollercoaster2.gif', (req, res) => res.sendFile(__dirname + '/img/rollercoaster2.gif'))
app.get('/img/ethereum.gif', (req, res) => res.sendFile(__dirname + '/img/ethereum.gif'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

