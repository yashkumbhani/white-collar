const fs = require('fs');

const operations = require('./operations');
const livePosition = require('./utils/live-position');
const {QUANTITY} = require('./enums/enums');

module.exports = async function(myPreviousOrder, currentQuote, previousQuote, EMA) {
  if (currentQuote.lastPrice >= EMA && previousQuote.lastPrice <= EMA) {
    //  await operations.deleteAllOpen();
    const executedPositions = await operations.listPositions();
    const lp = livePosition(executedPositions);
    const quantity = (lp && lp.type === 'Sell')
      ? lp.currentQty * 2
      : QUANTITY;
    myPreviousOrder = await operations.createOrder('XBTUSD', 'Buy', quantity, null, currentQuote.lastPrice);
    fs.writeFile('message.txt', `BUY Order : EMA : , ${EMA}`);
    console.log('BUY Order : EMA : ', currentQuote.lastPrice)
  } else if (currentQuote.lastPrice <= EMA && previousQuote.lastPrice >= EMA) {
    const executedPositions = await operations.listPositions();
    const lp = livePosition(executedPositions);
    const quantity = (lp && lp.type === 'Buy')
      ? lp.currentQty * 2
      : QUANTITY;
    myPreviousOrder = await operations.createOrder('XBTUSD', 'Sell', quantity, null, currentQuote.lastPrice);
    fs.writeFile('message.txt', `Sell Order : EMA : , ${currentQuote.lastPrice}`);
    console.log('Sell Order : EMA : ', EMA)
  }
}
