var main = function () {

    var coin_list = ["BTCCAD", "ETHCAD", "LTCCAD"]

    $("#coins").append(
            coin_list.map((coin) =>
                `<div class="coin" id="${coin}">
                    <span>${coin}</span>
                    <span class="price">-</span>
                 </div>`
                )
            )
  
    var get_price = (coin) => {

        xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var json = JSON.parse(this.responseText)
                var price = Number(json[0]["ticker"]["ask"]).toFixed(2)
                $(`#${coin} > .price`).text(`$${price}`)
                console.log(json["ask"])
            }
        }

        xhr.open("GET",
                 `https://api.nexchange.io/en/api/v1/price/${coin}/latest/`);
        xhr.send();
    }

    coin_list.map(get_price)
}

$(document).ready(main)
