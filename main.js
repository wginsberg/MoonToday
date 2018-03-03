var ALL_COINS = ["BTCCAD", "ETHCAD", "LTCCAD"]

var state = {
    currentPage: "wallets",
    wallets: [],
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
}

$(document).ready(main)
