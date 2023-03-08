let chart;
const currencies = ['bitcoin', 'ethereum', 'litecoin'];
const apiUrls = currencies.map(currency => `https://api.coingecko.com/api/v3/coins/${currency}/market_chart?vs_currency=usd&days=30`);
const buttons = document.getElementById('buttons');

function getCryptoPrices(currency) {
  const apiUrl = `https://api.coingecko.com/api/v3/coins/${currency}/market_chart?vs_currency=usd&days=30`;
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById('prices');
      table.innerHTML = `
        <tr>
          <th>Currency</th>
          <th>Price (USD)</th>
        </tr>
      `;
      
      const prices = data.prices.map(price => price[1]);
      const labels = data.prices.map(price => new Date(price[0]).toLocaleDateString());
      updateChart(currency, prices, labels);
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${currency.toUpperCase()}</td>
        <td>${prices.slice(-1)[0]}</td>
      `;
      table.appendChild(row);
    })
    .catch(error => {
      console.error(error);
      document.getElementById('prices').innerHTML = 'Error retrieving cryptocurrency prices';
    });
}

function updateChart(currency, prices, labels) {
  if (chart) {
    chart.destroy();
  }
  
  chart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${currency.toUpperCase()} Price`,
        data: prices,
        fill: false,
        borderColor: '#FF4136', // change primary color to red
        borderWidth: 2,
      }],
    },
    options: {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'day',
          },
          ticks: {
            fontColor: 'white',
          },
        }],
        yAxes: [{
          ticks: {
            fontColor: 'white',
          },
        }],
      },
      legend: {
        labels: {
          fontColor: 'white',
          fontSize: 16,
        },
      },
    },
  });
}

currencies.forEach(currency => {
  const button = document.createElement('button');
  button.innerText = currency.toUpperCase();
  button.addEventListener('click', () => getCryptoPrices(currency));
  buttons.appendChild(button);
});
