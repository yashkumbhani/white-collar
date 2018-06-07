const rp = require('request-promise');
const crypto = require('crypto');
const fs = require('fs');
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const baseURL = process.env.BASE_URL;
const {SYMBOL} = require('../enums/enums');

module.exports = function getPosition(EMA, lastPrice) {
  const verb = 'POST',
    path = '/api/v1/position/isolate',
    expires = new Date().getTime() + (60 * 1000 * 3); // 3 min in the future

  const formData = {
    symbol: SYMBOL,
    enabled:true
  };
  const postBody = JSON.stringify(formData);
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
    uri: `${baseURL}/api/v1/position/isolate`,
    body: formData,
    json: true
  };

  return rp(options).then(function(parsedBody) {
  //  fs.appendFile('positions.txt', ` \n Positions : ${parsedBody.currentQty} , EMA: ${EMA}`,() => {});
    console.log(` - -Positions : ${parsedBody.currentQty} , EMA: ${EMA} : Last Price: ${lastPrice}`);
    return parsedBody;
  }).catch(function(err) {
    console.log(err.message , '-- err  List positions--');
  });
}






// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
