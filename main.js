var DEFAULT_PAIRS = ["BTCCAD", "ETHCAD", "LTCCAD"]

var state = {
    currentPage: "wallets",
    wallets: [],
    pairs: [],
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
                .filter((name) => DEFAULT_PAIRS.indexOf(name) == -1)
            state.pairs = _state

            autocompleteInit()
        }
    }
    xhr.open("GET", "https://api.nexchange.io/en/api/v1/pair/");
    xhr.send();
}

var navigate = (page) => {

    switch (page) {
        case "doughnutChart":
            $("main").load("doughnutChart.html", doughnutChart)
            break;
        case "wallets":
            $("main").load("wallets.html", wallets)
            break;
    }

    $(".nav-link").removeClass("active")
    $(`#${page}`).addClass("active")

    state.currentPage = page
}

var main = () => {
    navigate("wallets")
    get_pairs()
}

$(document).ready(main)
