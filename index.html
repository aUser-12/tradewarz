<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Stock Trading Game</title>
  <script src="https://unpkg.com/lightweight-charts@4.1.2/dist/lightweight-charts.standalone.production.js"></script>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    #chart-container { width: 80vw; max-width: 900px; margin: 40px auto; height: 400px; }
    #tvchart { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <h2>Stock Trading Game</h2>
  <form id="ticker-form">
    <label for="ticker">Enter Stock Ticker Symbol:</label>
    <input type="text" id="ticker" name="ticker" required>
    <button type="submit">Start Match</button>
  </form>
  <div id="chart-container">
    <div id="tvchart"></div>
  </div>
  <script>
    const apiKey = 'LCGSSV9SQVS6F5MX';
    const form = document.getElementById('ticker-form');
    let chart = null;
    let series = null;
    let fixedRandomDate = null;
    let currentTicker = null;
    let updateInterval = null;

    // Set interval to 15 seconds (4 requests per minute)
    const REQUEST_INTERVAL_MS = 15000;

    async function fetchAndDrawChart(ticker) {
      // Fetch daily data
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      const timeSeries = data['Time Series (Daily)'];
      if (!timeSeries) {
        alert('No data found for this ticker.');
        return;
      }

      // Fix the random date for all stocks on first submit
      const allDates = Object.keys(timeSeries);
      if (!fixedRandomDate) {
        fixedRandomDate = allDates[Math.floor(Math.random() * allDates.length)];
      }

      // Get 30 days of data ending at the fixed random date (if possible)
      const randomIndex = allDates.indexOf(fixedRandomDate);
      let matchDates = allDates.slice(randomIndex, randomIndex + 30).reverse();
      if (matchDates.length < 2) {
        alert('Not enough data for this match. Try again.');
        return;
      }
      const prices = matchDates.map(date => parseFloat(timeSeries[date]['4. close']));

      // Prepare data for TradingView Lightweight Charts (hide dates, use index as time)
      const chartData = prices.map((price, i) => ({
        time: i + 1, // Use sequential numbers as time
        value: price
      }));

      // Draw chart
      if (chart) {
        chart.remove();
      }
      chart = LightweightCharts.createChart(document.getElementById('tvchart'), {
        width: document.getElementById('tvchart').clientWidth,
        height: document.getElementById('tvchart').clientHeight,
        layout: { background: { color: '#fff' }, textColor: '#222' },
        rightPriceScale: { borderColor: '#ccc' },
        timeScale: {
          borderColor: '#ccc',
          timeVisible: false,
          secondsVisible: false,
          tickMarkFormatter: (time) => `Day ${time}`
        },
        grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } }
      });
      series = chart.addLineSeries({
        color: 'blue',
        lineWidth: 2
      });
      series.setData(chartData);

      // Hide time scale labels, show only "Day 1", "Day 2", ...
      chart.timeScale().applyOptions({
        timeVisible: false,
        secondsVisible: false,
        tickMarkFormatter: (time) => `Day ${time}`
      });
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const ticker = document.getElementById('ticker').value.trim().toUpperCase();
      if (!ticker) return;
      currentTicker = ticker;
      if (updateInterval) clearInterval(updateInterval);

      fetchAndDrawChart(currentTicker);
      updateInterval = setInterval(() => {
        fetchAndDrawChart(currentTicker);
      }, REQUEST_INTERVAL_MS);
    });
  </script>
</body>
</html>