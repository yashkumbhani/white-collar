const livePosition = require('./live-position');
const operations = require('../operations');
const { PROFIT, LOSS } = require('../enums/enums');

module.exports = async function(currentQuote, executedPositions){
  const lp = livePosition(executedPositions) || {};
  const type = lp.type;
  if(type === 'Buy'){
    if((currentQuote.lastPrice > executedPositions.avgEntryPrice + PROFIT) || (currentQuote.lastPrice < executedPositions.avgEntryPrice - LOSS)) {
      const cp = await operations.closePosition(currentQuote.lastPrice);
    }
  }else if(type === 'Sell'){
    if((currentQuote.lastPrice < executedPositions.avgEntryPrice - PROFIT) || (currentQuote.lastPrice > executedPositions.avgEntryPrice + LOSS)){
    const cp = await operations.closePosition(currentQuote.lastPrice);
    }
  }
  return false
}
