var doughnutChart = function () {
    console.log(state)
    var dataPoints = state.wallets.map((wallet) => ({
        label: wallet.pair, 
        y: Number(wallet.value)
    }))

    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      data: [{
        type: "doughnut",
        startAngle: 60,
        indexLabelFontSize: 17,
        indexLabel: "{label} (${y}) - #percent%",
        toolTipContent: "<b>{label}:</b> {y} (#percent%)",
        dataPoints: dataPoints
      }]
    });
    chart.render();
}
