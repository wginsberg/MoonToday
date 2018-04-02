var wallets = function () {
    // Avoid duplicate entries on navigation
    if (state.wallets.length) {
        return
    }
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText)
            for(item of json){
                var coin = item['pair']
                var amount = item['amount']
                var custom = item['custom']
                if (custom) {
                    item['value'] = (item['amount'] * item['price']).toFixed(2)
                    addRow(item)
                    state.wallets.push(item)
                } else {
                    get_price(coin, amount)
                }
            }
            updateTotal()
        }
    }

    xhr.open("GET", `http://localhost:3000/wallets/${get_cookie()}`);
    xhr.send();
}

var add_coin_to_server = (coin, custom) => {
    xhr = new XMLHttpRequest();
    console.log(`http://localhost:3000/wallets/${get_cookie()}/${coin}`)
    xhr.open("PUT",
             `http://localhost:3000/wallets/${get_cookie()}/${coin}`);
    xhr.send(custom ? true : '');
}

var addToWallet = (_, {custom}) => {
    var pair = $("#search")[0].value
    // Avoid duplicates
    if (!state.wallets.filter((wallet) => wallet.pair == pair).length) {
        if (custom) {
            var _state = {
                pair: pair,
                amount: "0.0",
                price: "0.00",
                value: "0.0",
                custom: true
            }
            addRow(_state)
            state.wallets.push(_state)
        } else {
             get_price(pair, "0.0")
        }
        add_coin_to_server(pair, custom)
        state.pairs.pop(state.pairs.indexOf(pair))
    }
}

var amountInput = (amount) => {
    return `<input type="number" class="form-control" value="${amount}" step="0.1" min="0" oninput="amountChange(this)">`
}

var priceInput = (price) => {
    return `<input type="number" class="form-control" value="${price}" step="0.01" min="0" oninput="priceChange(this)">`
}

var addRow = ({pair, amount, price, value, custom}) => {
    $("#coins").append(`
        <tr class="coin" id="${pair}">
            <td><a href="#" onclick="state.currentPair=event.target.text; navigate('insights')">${pair}</a></td>
            <td><button onclick="remove_coin('${pair}')"><i class="fa fa-trash"></i></button></td>
            <td>${amountInput(amount)}</td>
            <td class="price">${custom ? priceInput(price) : price}</td>
            <td class="value">${value}</td>
        </tr>`)
}

var get_price = (coin, coin_amount) => {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText)
            var price = Number(json[0]["ticker"]["ask"]).toFixed(2)

            var _state = {
                pair: coin,
                amount: coin_amount,
                price: price,
                value: price*coin_amount,
            }
            state.wallets.push(_state)

            addRow(_state)

            updateTotal()
        }
    }
    xhr.open("GET",
             `https://api.nexchange.io/en/api/v1/price/${coin}/latest/`);
    xhr.send();
}

var updateTotal = () => {
    var total_value = state.wallets.map(({name, amount, price, value}) => value)
                .map(Number)
                .reduce((a,b) => a+b, 0)
                .toFixed(2)
    var total = $("tfoot > tr > .value").text(`$${total_value}`)
}

var updateAmountServer = (coin, amount) => {
    xhr = new XMLHttpRequest();
    xhr.open("PUT", `http://localhost:3000/wallets/${get_cookie()}/${coin}/amount/`);
    xhr.send(amount);
}

var updatePriceServer = (coin, price) => {
    xhr = new XMLHttpRequest();
    xhr.open("PUT", `http://localhost:3000/wallets/${get_cookie()}/${coin}/price/`);
    xhr.send(price);
}

var amountChange = e => {

        // Get element
        var coin = e.parentElement.parentElement.id

        // Update state
        var _state = state.wallets.filter(({pair}) => pair == coin)[0]
        _state.amount = e.valueAsNumber
        _state.value = (_state.amount * _state.price).toFixed(2)

        // Update element
        $(`#${coin} > .value`).text(`$${_state.value}`)

        updateTotal()
        updateAmountServer(coin, _state.amount)
}

var priceChange = e => {

        // Get element
        var coin = e.parentElement.parentElement.id

        // Update state
        var _state = state.wallets.filter(({pair}) => pair == coin)[0]
        _state.price = e.valueAsNumber
        _state.value = (_state.amount * _state.price).toFixed(2)

        // Update element
        $(`#${coin} > .value`).text(`$${_state.value}`)

        updateTotal()
        updatePriceServer(coin, _state.price)
}

var remove_coin = (pair) => {
    // Remove from database
    xhr = new XMLHttpRequest();
    console.log(`http://localhost:3000/wallets/${get_cookie()}/${pair}`)
    xhr.open("DELETE",
             `http://localhost:3000/wallets/${get_cookie()}/${pair}`);
    xhr.send();

    // remove from html
    $(`#${pair}`).remove()

    // remove from state.wallets
    for (var i=0; i<state.wallets.length; i++){
        if (state.wallets[i].pair == pair){
            console.log(`removed ${state.wallets[i].pair}`)
            state.wallets.splice(i, 1)
            break
        }
    }
}
