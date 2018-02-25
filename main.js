var amountChange = e => {
        var coin = e.parentElement.parentElement.id
        var total = $(`#${coin} > .total`)
        var unit_price = $(`#${coin} > .price`)[0].innerText.slice(1)
        var amount = e.valueAsNumber
        total.text(`$${(unit_price * amount).toFixed(2)}`)
    }

var amountInput = '<input type="number" class="form-control amount" value="1.0" step="0.1" min="0" oninput="amountChange(this)">'

var get_price = (coin) => {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText)
            var price = Number(json[0]["ticker"]["ask"]).toFixed(2)
            $(`#${coin} > .price`).text(`$${price}`)
            $(`#${coin} > .total`).text(`$${price}`)
        }
    }
    xhr.open("GET",
             `https://api.nexchange.io/en/api/v1/price/${coin}/latest/`);
    xhr.send();
}

var main = function () {

    var coin_list = ["BTCCAD", "ETHCAD", "LTCCAD"]

    // Add a row to table for each coin
    $("#coins").append(
            coin_list.map((coin) =>
                `<tr class="coin" id="${coin}">
                    <td>${coin}</td>
                    <td>${amountInput}</td>
                    <td class="price">-</td>
                    <td class="total">-</td>
                 </tr>`
                )
            )

    // Hit nexchange API for prices
    coin_list.map(get_price)
}

$(document).ready(main)
