const priceChart = new Chart(document.getElementById('price-chart'), {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'BTC-KAS Price',
        data: [10, 20, 30, 25, 35, 45, 50, 40, 30, 35, 40, 45],
        borderColor: '#007bff',
        fill: false
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'BTC-KAS Price Chart'
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Price (USD)'
          }
        }]
      }
    }
  });
  