const rp = require('request-promise');
const crypto = require('crypto');
const fs = require('fs');
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const baseURL = process.env.BASE_URL;
const {SYMBOL} = require('../enums/enums');

module.exports = function deleteAllOpen(price) {
  const verb = 'DELETE',
    path = '/api/v1/order/all',
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
    method: 'DELETE',
    headers: headers,
    uri: `${baseURL}/api/v1/order/all`,
    body: data,
    json: true // Automatically stringifies the body to JSON
  };

  return rp(options).then(function(parsedBody) {
    const [openPosition] = parsedBody;
    if(openPosition){
      fs.appendFile('message.txt', `\nPosition Deleted  : ${openPosition.symbol} : canceled open Price : ${openPosition.price} : Quanity: ${openPosition.orderQty} : OrderStatus ${openPosition.ordStatus}: OrderTye:${openPosition.side} : Time : ${openPosition.transactTime}`,() => {});
    }
    else{
      fs.appendFile('message.txt', 'No open positions to Delete');
    }
    return parsedBody;
  }).catch(function(err) {
    return fs.appendFile('message.txt',`${err.message}`,() => {return;});
  });
}
