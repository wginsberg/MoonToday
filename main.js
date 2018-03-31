var state = {
    currentPage: "wallets",
    currentPair: "",
    wallets: [],
    pairs: []
}

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

var autocompleteInit = () => {
    $('#search').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'states',
      source: substringMatcher(state.pairs)
    }).on("typeahead:selected", addToWallet);
}

var get_pairs = () => {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText)
            _state = json
                .map((json) => json.name)
            state.pairs = _state

            autocompleteInit()
        }
    }
    xhr.open("GET", "https://api.nexchange.io/en/api/v1/pair/");
    xhr.send();
}

var navigate = (page) => {

    // Change view
    $(`#${state.currentPage}View`).hide()
    $(`#${page}View`).show()
    window[page]()

    // Update nav

    $(".nav-link").removeClass("active")
    $(`#${page}`).addClass("active")

    // Update state

    state.currentPage = page
}

var main = () => {
    navigate("wallets")
    get_pairs()
    setCookieField()
}

var doughnutChart = function () {
    var dataPoints = []
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            console.log(key, dict[key]);
            dataPoints.push({
                label : key,
                y : dict[key]
            })
        }
    }
    console.log(dataPoints)
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
