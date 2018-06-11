const fs = require('fs');
const rp = require('request-promise');
const crypto = require('crypto');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const baseURL = process.env.BASE_URL;
const {SYMBOL} = require('../enums/enums');

module.exports = function closePosition(price, log) {
  const verb = 'POST',
    path = '/api/v1/order/closePosition',
    expires = new Date().getTime() + (60 * 1000 * 3), // 3 min in the future
    data = {
      price:price,
      symbol:SYMBOL
    };
  const postBody = JSON.stringify(data);

  const signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

  const  headers = {
    'content-type' : 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'api-expires': expires,
    'api-key': apiKey,
    'api-signature': signature
  };

  var options = {
    method: 'POST',
    headers: headers,
    uri: `${baseURL}/api/v1/order/closePosition`,
    body: data,
    json: true // Automatically stringifies the body to JSON
  };

  return rp(options).then(function(parsedBody) {
    console.log(`Position Closed: ${parsedBody.orderQty} at ${parsedBody.price}`)
    fs.appendFile('message.txt', `\nPosition Closed  :${log} : ${parsedBody.symbol} : Opening Price : ${parsedBody.price} : Quanity: ${parsedBody.orderQty} : OrderStatus ${parsedBody.ordStatus}: Time : ${parsedBody.transactTime}`,() => {});
    return parsedBody;
  }).catch(function(err) {
    return fs.appendFile('error.txt', `Position Closed error :${err.message}`,() => {return;});

  });
}






// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
