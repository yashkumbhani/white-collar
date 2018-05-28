
const rp = require('request-promise');

module.exports = function (){
  var options = {
    method: 'POST',
    uri: 'https://scanner.tradingview.com/crypto/scan',
    headers:{
      Host:'scanner.tradingview.com',
      Origin:'https://uk.tradingview.com',
      Referer:'https://uk.tradingview.com/symbols/BTCUSD/technicals/',
      'Content-Type':'application/json'
    },
    body:{"symbols":{"tickers":["BITFINEX:BTCUSD"],"query":{"types":[]}},"columns":["EMA20|1","EMA30|1","EMA50|5"]},
    json: true
  };

  return rp(options).then(function(data) {
    return data.data[0].d[2];
    // POST succeeded...
  }).catch(function(err) {
    console.log(err , '-- err --');
    // POST failed...
  });
}
