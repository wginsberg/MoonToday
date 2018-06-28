// Top level functions

var insights = (hours) => {
    hours = hours || 24
    draw_chart(hours, "price_chart", render_insights_chart, PAIR_AGGREGATE)
    get_market_data(hours)
    get_holding_value(hours)
}

var wallet_modal = (event) => {
    
    state.currentPair = event.text 
    
    $("#dialogBox").dialog({
        open: (event, ui) => {
            $(".ui-widget-overlay").bind("click", function(event,ui) {         
                $("#dialogBox").dialog("close");
            })
        },
        closeOnEscape: true,
        draggable: false,
        resizable: false,
        title: `24 Hr ${state.currentPair} Performance`,
        modal: true,
    });
    $(".ui-widget-overlay").css({"background-color": "#111111"});

    draw_chart(24, "wallet_chart", render_wallet_modal)
}

// Renderers

var render_insights_chart = (chart, data_pts, pair, data) => {
    data_pts.filter(line => line.name == pair)[0].dataPoints = data
    $('#loader_chart').hide()
    $('#price_chart').show()
    chart.render();
}

var render_wallet_modal = (chart, data_pts, pair, data) => {
    data_pts[0].dataPoints = data
    chart.render()
}

// Main function

var draw_chart = (hours, chart_id, render, pair) => {
    trading_pair = pair || state.currentPair
    data_points = hours
    num_days = hours/24
 
    var price_url = (pair) => `https://api.nexchange.io/en/api/v1/price/${pair}/history/?hours=${hours}&data_points=${data_points}&market_code=nex`

    // Prepare a list of data series using the data sources
    var _data_pt = {
        type: "spline",
        showInLegend: trading_pair == PAIR_AGGREGATE,
    }

    var wallets = trading_pair == PAIR_AGGREGATE ? 
                  state.wallets :
                  state.wallets.filter(wallet => wallet.pair == trading_pair)

    var data_pts = wallets.map(wallet => wallet.pair)
                          .map(pair => Object.assign({}, 
                                                     _data_pt,
                                                     {name: pair, dataPoints: []}))

    if (num_days > 1)
        title_text = `${num_days} Day ${trading_pair} Performance`
    else
        title_text = `24 Hr ${trading_pair} Performance`
        
    var chart = new CanvasJS.Chart(chart_id, {
        title: {
            text: trading_pair == PAIR_AGGREGATE ? title_text : null
        },
        axisY: {
            prefix: "$",
            includeZero: false,
        },
        toolTip: {
            shared: true,
            content: "<span style='\"'color: {color};'\"'>{name}</span>: ${y}"
        },
        data: data_pts
    });

    var parse_history = (pair, data) => {
        data = data.map((item) => {
                    price = Number(item['ticker']['ask']) + Number(item['ticker']['bid'])
                    price *=  0.5
                    price = Number(price.toFixed(2))
                    date = new Date(item['created_on'])
                    date.setMinutes(0)
                    date.setSeconds(0)
                    date.setMilliseconds(0)
                    return {x: date, y: price}
                })
        render(chart, data_pts, pair, data)
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
   
    data_pts.map(line => line.name) 
           .map((pair) => make_request(pair, price_url(pair)))
}
