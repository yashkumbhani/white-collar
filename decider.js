const operations = require('./operations');
const livePosition = require('./utils/live-position');
const shouldClose = require('./utils/should-close');

const {QUANTITY, PRICE_DIFFERENCE, SYMBOL} = require('./enums/enums');

module.exports = async function(myPreviousOrder, currentQuote, previousQuote) {

  let EMA = await stratergies.EMA.EMA_55();

  const executedPositions = await operations.listPositions(EMA, currentQuote.lastPrice);

  const currentQty = executedPositions.currentQty;
  const didClose = shouldClose(currentQuote, executedPositions)
  if (Math.floor(currentQuote.lastPrice) >= Math.floor(EMA) +1  && previousQuote.lastPrice -1 <= EMA) {
    await operations.deleteAllOpen();
    if( currentQty <=0 ){
      const lp = livePosition(executedPositions);
      const quantity = (lp && lp.type === 'Sell')
        ? lp.currentQty * 2
        : QUANTITY;
      myPreviousOrder = await operations.createOrder(SYMBOL, 'Buy', quantity, null, (currentQuote.lastPrice - PRICE_DIFFERENCE), previousQuote.lastPrice);
    }
  } else if (Math.ceil(currentQuote.lastPrice)  <= Math.ceil(EMA) -1 && previousQuote.lastPrice +1 >= EMA ) {
    await operations.deleteAllOpen();
    if(currentQty >= 0) {
      const lp = livePosition(executedPositions);
      const quantity = (lp && lp.type === 'Buy')
        ? lp.currentQty * 2
        : QUANTITY;
      myPreviousOrder = await operations.createOrder(SYMBOL, 'Sell', quantity, null, (currentQuote.lastPrice + PRICE_DIFFERENCE), previousQuote.lastPrice);
    }
  }
}
