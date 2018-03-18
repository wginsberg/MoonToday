var wallets = function () {

    if (!state.wallets.length) {
        DEFAULT_PAIRS.map(get_price)
    }
}

var addToWallet = (coin) => {
    var name = $("#search")[0].value

    // Exists in our list of pairs and is not already in wallets
    var valid = state.pairs.indexOf(name) != -1 && 
        state.wallets.filter((wallet) => wallet.name == name).length == 0

    if (valid) {
        get_price(name)
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

var get_price = (coin) => {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText)
            var price = Number(json[0]["ticker"]["ask"]).toFixed(2)

            var _state = {
                name: coin,
                amount: "1.0",
                price: price,
                value: price,
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
}
