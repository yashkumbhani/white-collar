module.exports = function(currency, type, orderQty, leverage, price, clOrdID, clOrdLinkID, orderID, origClOrdID){

  const body = {
    orderID:orderID,
    origClOrdID:origClOrdID,
    symbol:currency,
    side: type,
    orderQty:orderQty,
    price: price,
    clOrdID:clOrdID,
    clOrdLinkID:clOrdLinkID,
    ordType: 'Limit',
    timeInForce: 'GoodTillCancel'
  }
  return body;
}
