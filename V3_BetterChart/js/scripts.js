const chartContainer = document.getElementById('chart');

const chartColors = {
  red: '#FF4136',
  green: '#2ECC40',
  blue: '#0074D9',
  purple: '#B10DC9',
  orange: '#FF851B',
  yellow: '#FFDC00',
  gray: '#AAAAAA',
};

function getCryptoPrices() {
  const apiUrl = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365';

  fetch(apiUrl)
    .then(handleResponse)
    .then(displayData)
    .catch(handleError);
}

function handleResponse(response) {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

function displayData(data) {
  const prices = data.prices.map(price => price[1]);
  const labels = data.prices.map(price => new Date(price[0]).toLocaleDateString());
  const movingAverage = calculateMovingAverage(prices, 30);
  updateChart('Bitcoin', prices, labels, movingAverage);
  displayTable(data.prices);
}

function handleError(error) {
  console.error(error);
  displayError();
}

function displayTable(prices) {
  const table = document.getElementById('prices');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Date</th>
        <th>Price 90 Days Ago</th>
        <th>Price 60 Days Ago</th>
        <th>Price 30 Days Ago</th>
        <th>% Change (30 Days)</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;

  const tableData = prices.slice(prices.length - 90);
  const tableBody = table.querySelector('tbody');
  const last30DaysPrices = tableData.slice(-30).map(price => price[1]);
  const last30DaysChange = calculatePercentageChange(last30DaysPrices);

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${new Date(tableData[0][0]).toLocaleDateString()}</td>
    <td>${formatPrice(tableData[60][1])}</td>
    <td>${formatPrice(tableData[30][1])}</td>
    <td>${formatPrice(tableData[0][1])}</td>
    <td>${formatPercentage(last30DaysChange)}</td>
  `;
  tableBody.appendChild(row);
}

function calculatePercentageChange(prices) {
  const startPrice = prices[0];
  const endPrice = prices[prices.length - 1];
  const change = endPrice - startPrice;
  const percentChange = (change / startPrice) * 100;
  return percentChange;
}

function formatPercentage(percent) {
  return `${percent.toFixed(2)}%`;
}


function formatPrice(price) {
  return '$' + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}


function displayError() {
  const table = document.getElementById('prices');
  table.innerHTML = 'Error retrieving cryptocurrency prices';
}

function updateChart(currency, prices, labels, movingAverage) {
  const chart = new Chart(chartContainer, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${currency} Price`,
        data: prices,
        fill: false,
        borderColor: chartColors.green,
        borderWidth: 2,
      }, {
        label: `30-day Moving Average`,
        data: movingAverage,
        fill: false,
        borderColor: chartColors.orange,
        borderWidth: 2,
      }],
    },
    options: {
      title: {
        display: true,
        text: `${currency} Price (USD) over the Last Year`,
        fontColor: 'white',
        fontSize: 20,
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'month',
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
      tooltips: {
        callbacks: {
          title: (tooltipItem, data) => {
            return data.labels[tooltipItem[0].index];
          },
          label: (tooltipItem, data) => {
            return '$' + tooltipItem.yLabel.toFixed(2);
          },
        },
        backgroundColor: 'white',
        titleFontColor: 'black',
        bodyFontColor: 'black',
        borderColor: 'black',
        borderWidth: 1,
      },
    },
  });
}

function calculateMovingAverage(prices, windowSize) {
  const movingAverage = [];
  for (let i = 0; i < prices.length - windowSize + 1; i++) {
    const window = prices.slice(i, i + windowSize);
    const average = window.reduce((sum, price) => sum + price, 0) / windowSize;
    movingAverage.push(average);
  }
  return movingAverage;
}

getCryptoPrices();