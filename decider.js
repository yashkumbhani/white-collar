const operations = require('./operations');
const livePosition = require('./utils/live-position');
const shouldClose = require('./utils/should-close');

const {QUANTITY} = require('./enums/enums');

module.exports = async function(myPreviousOrder, currentQuote, previousQuote, EMA, executedPositions) {

  const currentQty = executedPositions.currentQty;
  const didClose = shouldClose(currentQuote, executedPositions)
  if (Math.floor(currentQuote.lastPrice) >= Math.floor(EMA) +1  && previousQuote.lastPrice -1 <= EMA && currentQty <=0) {
    await operations.deleteAllOpen();

    const lp = livePosition(executedPositions);
    const quantity = (lp && lp.type === 'Sell')
      ? lp.currentQty * 2
      : QUANTITY;
    myPreviousOrder = await operations.createOrder('XBTUSD', 'Buy', quantity, null, (currentQuote.lastPrice), previousQuote.lastPrice);
  } else if (Math.ceil(currentQuote.lastPrice)  <= Math.ceil(EMA) -1 && previousQuote.lastPrice +1 >= EMA && currentQty >= 0) {
    await operations.deleteAllOpen();

    const lp = livePosition(executedPositions);
    const quantity = (lp && lp.type === 'Buy')
      ? lp.currentQty * 2
      : QUANTITY;
    myPreviousOrder = await operations.createOrder('XBTUSD', 'Sell', quantity, null, (currentQuote.lastPrice), previousQuote.lastPrice);
  }
}
