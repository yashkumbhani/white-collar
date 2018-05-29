const livePosition = require('./live-position');
const operations = require('../operations');

const { PROFIT } = require('../enums/enums');

module.exports = async function(currentQuote, executedPositions){
  const lp = livePosition(executedPositions) || {};
  const type = lp.type;
  if(type === 'Buy'){
    if(currentQuote.lastPrice > executedPositions.avgEntryPrice + PROFIT ){
      await operations.closePosition(currentQuote.lastPrice);
    }
  }else if(type === 'Sell'){
    if(currentQuote.lastPrice < executedPositions.avgEntryPrice - PROFIT ){
    await operations.closePosition(currentQuote.lastPrice);
    }
  }
}
