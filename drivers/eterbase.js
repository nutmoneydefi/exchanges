const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Eterbase extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
  // get base and quote data for tickers
    const symbols = await request('https://api.eterbase.exchange/api/v1/markets');
    const pairs = {};

    symbols.forEach((el) => {
      pairs[el.id] = {
        base: el.base,
        quote: el.quote,
      };
    });

    const tickers = await request('https://api.eterbase.exchange/api/v1/tickers');

    return tickers.map((ticker) => {
      const { base, quote } = pairs[ticker.marketId];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.price),
        baseVolume: parseToFloat(ticker.volumeBase),
        quoteVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Eterbase;
