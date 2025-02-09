const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Walkex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data } = await request('https://backend.walkex.com/api/tickers');

    return Object.keys(data).map((pair) => {
      const ticker = data[pair];
      const [base, quote] = ticker.pair.split('_');

      return new Ticker({
        base,
        quote,
        close: parseToFloat(ticker.last),
        ask: parseToFloat(ticker.highestBid), // reversed with ask
        bid: parseToFloat(ticker.lowestAsk),
        quoteVolume: parseToFloat(ticker.volume24hr),
      });
    });
  }
}

module.exports = Walkex;
