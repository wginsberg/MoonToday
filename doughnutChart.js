var doughnutChart = function () {

    var dataPoints = state.wallets.map((wallet) => ({
        label: wallet.name, 
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
