const operations = require('./operations');
const livePosition = require('./utils/live-position');
const shouldClose = require('./utils/should-close');
const stratergies = require('./stratergies');

const {QUANTITY, PRICE_DIFFERENCE, SYMBOL} = require('./enums/enums');

module.exports = async function(currentQuote, previousQuote) {

  let EMA = await stratergies.EMA.EMA_55();
  let myPreviousOrder;

  const executedPositions = await operations.listPositions(EMA, currentQuote.lastPrice);
  const currentQty = executedPositions.currentQty;
  const didClose = shouldClose(currentQuote, executedPositions);
  if (Math.floor(currentQuote.lastPrice) >= Math.floor(EMA) +1  && previousQuote.lastPrice -1 <= EMA) {
    const deletePosition = await operations.deleteAllOpen();

    if( currentQty <=0 ){
      const lp = livePosition(executedPositions);
      const quantity = (lp && lp.type === 'Sell')
        ? lp.currentQty * 2
        : QUANTITY;
        console.log('[0]Placeing Buy order');
       myPreviousOrder = await operations.createOrder(SYMBOL, 'Buy', quantity, null, (currentQuote.lastPrice - PRICE_DIFFERENCE), previousQuote.lastPrice, EMA);
      console.log('[3]Buy order Placed');
    }
  } else if (Math.ceil(currentQuote.lastPrice)  <= Math.ceil(EMA) -1 && previousQuote.lastPrice +1 >= EMA ) {
    const deletePosition = await operations.deleteAllOpen();

    if(currentQty >= 0) {
      const lp = livePosition(executedPositions);
      const quantity = (lp && lp.type === 'Buy')
        ? lp.currentQty * 2
        : QUANTITY;
        console.log('[0]Placeing Sell order');
      myPreviousOrder = await operations.createOrder(SYMBOL, 'Sell', quantity, null, (currentQuote.lastPrice + PRICE_DIFFERENCE), previousQuote.lastPrice, EMA);
      console.log('[3]Sell order Placed');
    }
  }
  return myPreviousOrder;
}
