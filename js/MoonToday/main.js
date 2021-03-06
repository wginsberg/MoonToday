const PAIR_AGGREGATE = "Portfolio"

const base_url = `${window.location.protocol}\/\/${window.location.host}`

var state = {
    currentPage: "wallets",
    currentPair: "",
    wallets: [],
    pairs: [],
    insights: {
        movers: [] 
    }
}

var substringMatcher = (q, cb) => {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'gi');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(state.pairs, function(i, str) {
      if (substrRegex.test(str)) {
        match = {
            display: str,
            suggestion: str.replace(substrRegex, (x) => `<strong>${x}</strong>`)
        }
        matches.push(match);
      }
    });

    // Allow the user to add any custom string not in our list
    if (!matches.filter((match) => match.display == q.toUpperCase()).length) {
        var match = {
            display: q.toUpperCase(),
            suggestion: `Add <strong>'${q}'</strong> to wallet`,
            custom: true
        }
        // By default the typeahead shows only 5 items
        matches.splice(4, 0, match)
    }

    cb(matches);
};

var typeaheadSuggestion = ({suggestion}) => {
    return `<div class="tt-suggestion tt-selectable ">
                ${suggestion}
            </div>`
}

var autocompleteInit = () => {
    get_pairs()
    $('#search').typeahead({
      hint: true,
      highlight: false,
      minLength: 1
    },
    {
      name: 'states',
      source: substringMatcher,
      display: (data) => data.display,
      templates: {
        suggestion: typeaheadSuggestion
      }
    }).on("typeahead:selected", addToWallet)
      .on("typeahead:selected", () => $("#search").typeahead('val', ''))
      .on('keyup', this, function (event) {
            if (event.keyCode == 13) {
                $('.tt-selectable').first().trigger('click')
            }
        });
}

var get_pairs = () => {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText)
            _state = json
                .filter((json) => json.quote == "USD")
                .map((json) => json.name)
            state.pairs = _state

            var wallet_pairs = state.wallets.map((wallet) => wallet.pair)
            state.pairs = state.pairs.filter((pair) => wallet_pairs.indexOf(pair) == -1)

        }
    }
    xhr.open("GET", "https://api.nexchange.io/en/api/v1/pair/");
    xhr.send();
}

var navigate = (page) => {
    $(`#${state.currentPage}View`).hide()
    $(`#${page}View`).show()
    window[page]()

    // Update nav

    $(".nav-link").removeClass("active")
    $(`#${page}`).addClass("active")
    $("#navigation").removeClass("show")

    // Update state

    state.currentPage = page
}

var main = () => {
    init_cookie()
    navigate("wallets")
    autocompleteInit()
}

var disableDoughnutChart = () => {
    $("#doughnutChart").addClass("disabled")
}

var enableDoughnutChart = () => {
    $("#doughnutChart").removeClass("disabled")
}

var disableInsights = () => {
    $("#insights").addClass("disabled")
}

var enableInsights = () => {
    $("#insights").removeClass("disabled")
}


var doughnutChart = function () {
    var dataPoints = []
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            dataPoints.push({
                label : key,
                y : dict[key]
            })
        }
    }
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title:{
        text: "Total Poorfolio",
        horizontalAlign: "left"
      },
      data: [{
        type: "doughnut",
        startAngle: 60,
        //innerRadius: 60,
        indexLabelFontSize: 17,
        indexLabel: "{label} (${y}) - #percent%",
        toolTipContent: "<b>{label}:</b> {y} (#percent%)",
        dataPoints: dataPoints
      }]
    });
    chart.render();
}

$(document).ready(main)
