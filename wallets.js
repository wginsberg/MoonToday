var not_in_wallet = (coin) => {
    for (item of state.wallets){
        if (coin == item['name'])
            return false
    }
    return true
}

var wallets = function () {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText)
            for(item of json){
                var coin = item['pair']
                var amount = item['amount']

                if (not_in_wallet(coin)){
                    get_price(coin, amount)
                    state.pairs.pop(state.pairs.indexOf(coin))
                }
            }
        }
    }

    xhr.open("GET",
             `http://localhost:3000/wallets/${getCookie()}`);
    xhr.send();

    console.log(state)
}

var add_coin_to_server = (coin) => {
    xhr = new XMLHttpRequest();
    console.log(`http://localhost:3000/wallets/${getCookie()}/${coin}`)
    xhr.open("PUT",
             `http://localhost:3000/wallets/${getCookie()}/${coin}`);
    xhr.send();
}

var addToWallet = (coin) => {
    var name = $("#search")[0].value

    // Exists in our list of pairs and is not already in wallets
    var valid = state.pairs.indexOf(name) != -1 && 
        state.wallets.filter((wallet) => wallet.name == name).length == 0

    if (valid) {
        get_price(name, 0.0)
        add_coin_to_server(name)
        state.pairs.pop(state.pairs.indexOf(name))
    }
}

var addRow = ({name, amount, price, value}) => {
    $("#coins").append(`
        <tr class="coin" id="${name}">
            <td><a href="#" onclick="state.currentPair=event.target.text; navigate('insights')">${name}</a></td>
            <td>${amountInput(amount)}</td>
            <td class="price">${price}</td>
            <td class="value">${value}</td>
         </tr>`)
}

var amountInput = (amount) => {
    return `<input type="number" class="form-control amount" value="${amount}" step="0.1" min="0" oninput="amountChange(this)">`
}

var get_price = (coin, coin_amount) => {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText)
            var price = Number(json[0]["ticker"]["ask"]).toFixed(2)

            var _state = {
                name: coin,
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

var update_coin_in_server = (coin, amount) => {
    xhr = new XMLHttpRequest();
    console.log(`http://localhost:3000/wallets/${getCookie()}/${coin}/${amount}`)
    xhr.open("PUT",
             `http://localhost:3000/wallets/${getCookie()}/${coin}/${amount}`);
    xhr.send();
}

var amountChange = e => {
        
        // Get element
        var coin = e.parentElement.parentElement.id

        // Update state
        var _state = state.wallets.filter(({name, amount, price, value}) => name == coin)[0]
        _state.amount = e.valueAsNumber
        _state.value = (_state.amount * _state.price).toFixed(2)

        // Update element
        $(`#${coin} > .value`).text(`$${_state.value}`)

        updateTotal()
        update_coin_in_server(coin, _state.amount)
}
