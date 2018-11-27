// Setup express
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.text());

// Setup knex
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
    connection: config,
    debug: true
});


// Helper functions

var validateUser = (userid) => knex('users').where('userid', userid)

var addUser = (userid) => knex('users').insert({userid: userid}).then(() => userid)


var insertDefaultWallets = (userid) => {
    console.log(userid)
    return knex('wallet').insert([{userid: userid, pair: "BTCUSD", custom: false},
                                  {userid: userid, pair: "ETHUSD", custom: false},
                                  {userid: userid, pair: "LTCUSD", custom: false}])
                         .then(() => userid)
}

// CRUD operations

var getWallets = (req, res) => {
    
    var handleUser = () => knex('wallet').where('userid', req.params.userid)

    var handleNewUser = () => addUser(req.params.userid)
        .then(insertDefaultWallets)
        .then(handleUser)

    validateUser(req.params.userid)
        .then((result) => result.length ? handleUser() : handleNewUser())
        .then(res.send.bind(res))
        .catch((error) => {console.log(error); res.sendStatus(500)})
};

var addWallet = (req, res) => {
    var params = {
        userid: req.params.userid,
        pair: req.params.name,
        custom: Boolean(req.body.length)
    }
    knex('wallet').insert(params)
        .then(res.send.bind(res))
        .catch((error) => {console.log(error); res.sendStatus(500)})
}

var removePair = (req, res) => {
    knex('wallet').where({pair: req.params.name, userid: req.params.userid})
        .del()
        .then(() => undefined)
        .then(res.send.bind(res))
        .catch((error) => {console.log(error); res.sendStatus(500)})
}

var updateWallet = (req, res) => {
    knex('wallet').where({pair: req.params.name, userid: req.params.userid})
        .update('amount', req.body) 
        .then(() => undefined)
        .then(res.send.bind(res))
        .catch((error) => {console.log(error); res.sendStatus(500)})
}

// TODO track the price history of custom pairs
var updatePair = (req, res) => {
    knex('wallet').where({pair: req.params.name, userid: req.params.userid})
        .update('price', req.body)
        .then(() => undefined)
        .then(res.send.bind(res))
        .catch((error) => {console.log(error); res.sendStatus(500)})
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

// Supply javascript
app.get('/js/spin.js', (req, res) => res.sendFile(__dirname + '/js/spin.js'))
app.get('/main.js', (req, res) => res.sendFile(__dirname + '/js/MoonToday/main.js'))
app.get('/wallets.js', (req, res) => res.sendFile(__dirname + '/js/MoonToday/wallets.js'))
app.get('/doughnutChart.js', (req, res) => res.sendFile(__dirname + '/js/MoonToday/doughnutChart.js'))
app.get('/insights.js', (req, res) => res.sendFile(__dirname + '/js/MoonToday/insights.js'))
app.get('/market.js', (req, res) => res.sendFile(__dirname + '/js/MoonToday/market.js'))
app.get('/cookie.js', (req, res) => res.sendFile(__dirname + '/js/MoonToday/cookie.js'))

// Supply styles
app.get('/style.css', (req, res) => res.sendFile(__dirname + '/css/style.css'))
app.get('/graph_style.css', (req, res) => res.sendFile(__dirname + '/css/graph_style.css'))
app.get('/css/spin.css', (req, res) => res.sendFile(__dirname + '/css/spin.css'))

// Supply images
app.get('/img/moon.gif', (req, res) => res.sendFile(__dirname + '/img/moon.gif'))
app.get('/img/rollercoaster.gif', (req, res) => res.sendFile(__dirname + '/img/rollercoaster.gif'))
app.get('/img/rollercoaster2.gif', (req, res) => res.sendFile(__dirname + '/img/rollercoaster2.gif'))
app.get('/img/ethereum.gif', (req, res) => res.sendFile(__dirname + '/img/ethereum.gif'))

app.listen(8080, () => console.log('Moontoday app listening on port 8080!'))

