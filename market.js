var make_request = (url, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText)
            callback(data)
        }
    }
    xhr.open("GET", url);
    xhr.send();
}

var get_market_data = (hours) => {
    trading_pair = state.currentPair
    var data_points = 40
    var price_url = `https://api.nexchange.io/en/api/v1/price/${trading_pair}/history/?hours=${hours}&data_points=${data_points}&market_code=nex`

    var calculate_trend = (perc_change) => {
        if (perc_change >= 10)
            return 'BULLISH'
        if (perc_change <= -10)
            return 'BEARISH'
        else
            return 'NEUTRAL'
    }

    var parse_market = (data) => {
        var current_bid = Number(data[data_points-1]['ticker']['bid']).toFixed(2)
        var current_ask = Number(data[data_points-1]['ticker']['ask']).toFixed(2)

        data = data.map((item) => {
                    return 0.5*(Number(item['ticker']['ask']) + Number(item['ticker']['bid']))
                })

        var low = Math.min.apply(Math, data).toFixed(2)
        var high = Math.max.apply(Math, data).toFixed(2)
        var price_before = data[0]
        var current_price = data[data_points-1]
        var price_change = ((current_price-price_before)/price_before*100).toFixed(2)
        var trend = calculate_trend(price_change)    

        $(`#high`).text(`${high}`)
        $(`#low`).text(`${low}`)
        $(`#bid`).text(`${current_bid}`)
        $(`#ask`).text(`${current_ask}`)
        $(`#trend`).text(`${trend}`)

        if (price_change >= 0.0){
            $(`#change`).text(`+${price_change}%`)
        }
        else{
            $(`#change`).text(`${price_change}%`)
        }

        if (hours <= 24){
            $(`#market_title`).text(`${hours}hr Market Data`)
        }
        else{
            days = hours / 24
            $(`#market_title`).text(`${days} Day Market Data`)
        }

        $('#loader_market').hide()
        $('#market_data').show()
    }

    $('#market_data').hide()
    $('#loader_market').show()
    make_request(price_url, parse_market)
}

var get_holding_value = (hours) => {
    for(item of state.wallets){
        if(item.name == state.currentPair){
            this.quantity = Number(item.amount)
            break
        }
    }

    trading_pair = state.currentPair
    var data_points = 10
    var price_url = `https://api.nexchange.io/en/api/v1/price/${trading_pair}/history/?hours=${hours}&data_points=${data_points}&market_code=nex`

    var parse_holding = (data) => {
        var quantity = this.quantity

        data = data.map((item) => {
                    price = 0.5*(Number(item['ticker']['ask']) + Number(item['ticker']['bid']))
                    date = new Date(item['created_on'])
                    return price
                })

        var price_before = data[0]
        var current_price = data[data_points-1]
        var price_change = ((current_price-price_before)/price_before*100).toFixed(2)

        var value = (current_price*this.quantity).toFixed(2)
        var quantity = quantity.toFixed(2)


        $(`#value`).text(`${value}`)
        $(`#quantity`).text(`${quantity}`)

        if (price_change >= 0.0){
            $(`#holding_change`).text(`+${price_change}%`)
        }
        else{
            $(`#holding_change`).text(`${price_change}%`)
        }

        $('#loader_holding').hide()
        $('#holding').show()
    }

    $('#holding').hide()
    $('#loader_holding').show()
    make_request(price_url, parse_holding)
}

