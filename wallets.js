var wallets = function () {

    // Add a row to table for each coin
    $("#coins").append(
            ALL_COINS.map((coin) =>
                `<tr class="coin" id="${coin}">
                    <td>${coin}</td>
                    <td>${amountInput(coin)}</td>
                    <td class="price">-</td>
                    <td class="value">-</td>
                 </tr>`
                )
            )

    // Add each wallet to the table
    if (state.wallets.length) {
        state.wallets.map(render)
        updateTotal()
    } else {
        ALL_COINS.map(get_price)
    }
}

var amountInput = function(coin){
    var _state = state.wallets.filter(({name, amount, price, value}) => name == coin)
    var value = _state.length ? _state[0].amount : 1.0
    return `<input type="number" class="form-control amount" value="${value}" step="0.1" min="0" oninput="amountChange(this)">`
}

var render = ({name, amount, price, value}) => {
    $(`#${name} > .price`).text(`$${price}`)
    $(`#${name} > .value`).text(`$${value}`)    
}

var get_price = (coin) => {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText)
            var price = Number(json[0]["ticker"]["ask"]).toFixed(2)

            var _state = {
                name: coin,
                amount: 1.0,
                price: price,
                value: price,
            }
            state.wallets.push(_state)

            render(_state)

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
