var wallets = function () {
    
    // On repeat navigation to wallets, main.js handles everything
    if (state.wallets.length) {
        return
    }
    
    // Set spinner
    var spinner = new Spinner()
    spinner.spin(document.getElementById("walletsView"))

    // Populate wallet data
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText)
            
            // setup table
            spinner.stop()
            var table = $(table_scoffolding)
            
            // add rows
            for(item of json){
                var coin = item['pair']
                var amount = item['amount']
                var custom = item['custom']
                if (custom) {
                    item['value'] = (item['amount'] * item['price']).toFixed(2)
                }
                addRow(item, table)
                state.wallets.push(item)
            }
            $("#walletsView").append(table)
            // revisit this vvv
            updateTotal()
            
            json.filter((item) => !item['custom'])
                .map((item) => get_price(item['pair'], item['amount']))
        }
    }
    var url = window.location.href.split('?')[0]
    xhr.open("GET", `${url}wallets/${get_cookie()}`);
    xhr.send();
}

var table_scoffolding = `<table class="table table-striped table-sm">
                            <thead>
                                <tr>
                                    <th>Coin</th>
                                    <th width=40 border=0px></th>
                                    <th>Amount</th>
                                    <th>Unit Price ($)</th>
                                    <th>Value ($)</th>
                                </tr>
                            </thead>
                            <tbody id="coins"></tbody>
                            <tfoot>
                                <tr>
                                    <th>Total</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th class="value">-</th>
                                </tr>
                            </tfoot>
                        </table>`

var add_coin_to_server = (coin, custom) => {
    xhr = new XMLHttpRequest();
    var url = window.location.href.split('?')[0]
    xhr.open("PUT",
             `${url}wallets/${get_cookie()}/${coin}`);
    xhr.send(custom ? true : '');
}

var addToWallet = (_, {custom, name}) => {
    var pair = name || $("#search")[0].value
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
        state.pairs.splice(state.pairs.indexOf(pair), 1)
        
        // Animate navbar link
        var navbar_link = document.getElementById("wallets") 
        navbar_link.addEventListener("animationend",
                                     (e) => e.target.classList.remove("stretched"),
                                     false)
        navbar_link.classList.add("stretched")

        // Enable insights navbar link
        if (!custom) enableInsights()
    }
}

var amountInput = (amount) => {
    return `<input type="number" class="form-control" value="${amount}" step="0.1" min="0" oninput="amountChange(this)">`
}

var priceInput = (price) => {
    return `<input type="number" class="form-control" value="${price}" step="0.01" min="0" oninput="priceChange(this)">`
}

var addRow = ({pair, amount, price, value, custom}, table) => {
    table = table || $("#coins")
    
    // Prevent NaN from appearing in the table
    price = isFinite(price) ? price : ''
    value = isFinite(value) ? value : ''

    const name_a = `<a href="#" onclick="wallet_modal(this)">${pair}</a>`
    const name_p = `<p>${pair}</p>`
    var name_element = custom ? name_p : name_a

    table.append(`
        <tr class="coin" id="${pair}">
            <td>${name_element}</td>
            <td><button onclick="remove_coin('${pair}')"><i class="fa fa-trash"></i></button></td>
            <td>${amountInput(amount)}</td>
            <td class="price">${custom ? priceInput(price) : price}</td>
            <td class="value">${Number(value).toFixed(2)}</td>
        </tr>`)
}

var get_price = (coin, coin_amount) => {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText)
            var price = Number(json[0]["ticker"]["ask"]).toFixed(2)
            var value = Number(price * coin_amount).toFixed(2)

            var _state = state.wallets.find((wallet) => wallet.pair == coin)
            if (_state) {
                // Update existing wallet
                _state.price = price
                _state.value = value
                $(`#${coin} > td.price`).text(_state.price)
                $(`#${coin} > td.value`).text(_state.value)
            } else {
                // Add new wallet
                _state = {
                    pair: coin,
                    amount: coin_amount,
                    price: price,
                    value: price*coin_amount,
                }
                state.wallets.push(_state)
                addRow(_state)
            }
            
            // TODO move this
            state.pairs.splice(state.pairs.indexOf(coin), 1)
            updateTotal()

            // Trigger chart re-rendering
            if (state.currentPage != "wallets") navigate(state.currentPage)
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
    if (total_value > 0) {
        enableDoughnutChart()
    } else {
        disableDoughnutChart()
    }
    var formatted = total_value < 0.01 ? "> $0.00" : `$${total_value.toFixed(2)}`
    var total = $("tfoot > tr > .value").text(formatted)
}

var updateAmountServer = (coin, amount) => {
    var url = window.location.href.split('?')[0]
    xhr = new XMLHttpRequest();
    xhr.open("PUT", `${url}wallets/${get_cookie()}/${coin}/amount/`);
    xhr.send(amount);
}

var updatePriceServer = (coin, price) => {
    var url = window.location.href.split('?')[0]
    xhr = new XMLHttpRequest();
    xhr.open("PUT", `${url}wallets/${get_cookie()}/${coin}/price/`);
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
        $(`#${coin} > .value`).text(`${_state.value}`)

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
    var url = window.location.href.split('?')[0]
    xhr.open("DELETE",
             `${url}wallets/${get_cookie()}/${pair}`);
    xhr.send();

    // remove from state.wallets
    for (var i=0; i<state.wallets.length; i++){
        if (state.wallets[i].pair == pair){
            state.wallets.splice(i, 1)
            break
        }
    }
    // Add to state.pairs
    state.pairs.push(pair)

    // remove from html
    $(`#${pair}`).remove()
    updateTotal()

    // Disable insights navbar link
    if (!state.wallets.find((wallet) => !wallet.custom)) disableInsights()
}
