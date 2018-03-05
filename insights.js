var insights = (hours) => {
    draw_chart(hours)
    get_market_data(hours)
    get_holding_value(hours)
}

var draw_chart = (hours) => {
    trading_pair = state.currentPair
    data_points = 40
    num_days = hours/24
    price_url = `https://api.nexchange.io/en/api/v1/price/${trading_pair}/history/?hours=${hours}&data_points=${data_points}&market_code=nex`

    var render = (data_pts) => {
        if (num_days > 1)
            title_text = `Performance of ${trading_pair} ${num_days} Days`
        else
            title_text = `Performance of ${trading_pair} 24 Hrs`

        var chart = new CanvasJS.Chart("price_chart", {
            title:{
                text: title_text
            },
            axisY:{
                prefix: "$",
                includeZero: false,
            },
            data: [
                {
                    type: "line",
                    color: "#369EAD",
                    axisYIndex: 0,
                    showInLegend: false,
                    dataPoints: data_pts
                }
            ]
        });

   
        $('#loader_chart').hide()
        $('#price_chart').show()
        chart.render();
    }

    var parse_history = (data) => {
        data = data.map((item) => {
                    price = 0.5*(Number(item['ticker']['ask']) + Number(item['ticker']['bid']))
                    date = new Date(item['created_on'])
                    return {x: date, y: price}
                })

        render(data)
    }

    var make_request = (url) => {
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText)
                parse_history(data)
            }
        }
        xhr.open("GET", url);
        xhr.send();
    }

    $('#price_chart').hide()
    $('#loader_chart').show()
    make_request(price_url)
}