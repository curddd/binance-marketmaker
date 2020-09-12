# binance-marketmaker

Simple market maker for binance. Doens't include live trading yet.

Based on this paper: [Dealing with the Inventory Risk. A solution to the market making problem](https://arxiv.org/abs/1105.3115)
I basically copied the formulas. Ideally you want to adapt A and k for the current market situation on the fly.

You can run live tests with live_tester.js

For backtest first scrape data with db-scraper.js then playback with backtester.js but first copy the store.db file over to playback.db
