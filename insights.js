var insights = (hours) => {
    hours = hours || 24
    draw_chart(hours)
    get_market_data(hours)
    get_holding_value(hours)
}

var draw_chart = (hours) => {
    trading_pair = state.currentPair
    data_points = hours
    num_days = hours/24
   
    var price_url = (pair) => `https://api.nexchange.io/en/api/v1/price/${pair}/history/?hours=${hours}&data_points=${data_points}&market_code=nex`

    // Prepare a list of data series using the data sources
    var _data_pt = {
        type: "spline",
        showInLegend: true,
    }
    var data_pts = state.wallets.map(wallet => wallet.pair)
                                .map(pair => Object.assign({}, _data_pt, {name: pair, dataPoints: []}))

    if (num_days > 1)
        title_text = `Performance of ${trading_pair} ${num_days} Days`
    else
        title_text = `Performance of ${trading_pair} 24 Hrs`
        
    var chart = new CanvasJS.Chart("price_chart", {
        title: {
            text: title_text
        },
        axisY: {
            prefix: "$",
            includeZero: false,
        },
        toolTip: {
            shared: true,
        },
        data: data_pts
    });

    var render = (pair, data) => {
        data_pts.filter(line => line.name == pair)[0].dataPoints = data
        $('#loader_chart').hide()
        $('#price_chart').show()
        chart.render();
    }

    var parse_history = (pair, data) => {
        data = data.map((item) => {
                    price = 0.5*(Number(item['ticker']['ask']) + Number(item['ticker']['bid']))
                    date = new Date(item['created_on'])
                    date.setMinutes(0)
                    date.setSeconds(0)
                    date.setMilliseconds(0)
                    console.log(date)
                    return {x: date, y: price}
                })

        render(pair, data)
    }

    var make_request = (pair, url) => {
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText)
                parse_history(pair, data)
            }
        }
        xhr.open("GET", url);
        xhr.send();
    }

    $('#price_chart').hide()
    $('#loader_chart').show()
    
   data_pts.map(line => line.name) 
           .map((pair) => make_request(pair, price_url(pair)))
}
