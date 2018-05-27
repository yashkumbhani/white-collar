module.exports = function(currency, type, orderQty, leverage, price,clOrdID, clOrdLinkID){

  const body = {
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
