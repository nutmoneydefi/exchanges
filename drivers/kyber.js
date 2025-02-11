const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Kyber extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.kyber.network/market');
    const markets = tickers.data;

    return markets.map((ticker) => {
      const base = ticker.base_symbol;
      const quote = ticker.quote_symbol;

      return new Ticker({
        base,
        baseName: ticker.base_name,
        baseReference: ticker.base_address,
        quote,
        quoteName: ticker.quote_name,
        high: parseToFloat(ticker.past_24h_high),
        low: parseToFloat(ticker.past_24h_low),
        close: parseToFloat(ticker.last_traded),
        bid: parseToFloat(ticker.current_bid),
        ask: parseToFloat(ticker.current_ask),
        baseVolume: parseToFloat(ticker.token_24h_volume),
        quoteVolume: quote === 'ETH' ? parseToFloat(ticker.eth_24h_volume) : undefined,
      });
    });
  }
}

module.exports = Kyber;
