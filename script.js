const priceDiv = document.getElementById('price');
const usdPriceDiv = document.getElementById('usd-price');

async function fetchPrice() {
  const currencyPair = 'BTC-KAS'; // Fetch the price of BTC-KAS currency pair
  const apiUrl = `https://tradeogre.com/api/v1/ticker/${currencyPair}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const price = data.price;
    priceDiv.textContent = `Ƀ${price}`;

    // Get current BTC-USD exchange rate
    const btcUsdApiUrl = 'https://api.coinbase.com/v2/exchange-rates?currency=BTC';
    const btcUsdResponse = await fetch(btcUsdApiUrl);
    const btcUsdData = await btcUsdResponse.json();
    const btcUsdRate = btcUsdData.data.rates.USD;

    // Calculate USD value based on BTC-KASPA price and BTC-USD exchange rate
    const usdPrice = price * btcUsdRate;
    usdPriceDiv.textContent = `$${usdPrice.toFixed(7)}`;
  } catch (error) {
    priceDiv.textContent = 'Error fetching price';
    usdPriceDiv.textContent = '';
  }
}

window.addEventListener('load', async () => {
  await fetchPrice();
});
