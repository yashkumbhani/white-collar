const rp = require('request-promise');
const crypto = require('crypto');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const baseURL = process.env.BASE_URL;

module.exports = function deleteAllOpen(price) {
  const verb = 'DELETE',
    path = '/api/v1/order/all',
    expires = new Date().getTime() + (60 * 1000 * 3), // 3 min in the future
    data = {
      price:price,
      symbol:'XBTUSD'
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
    console.log(parsedBody , '---  parsedBody ---');
    return parsedBody;
    // PUT succeeded...
  }).catch(function(err) {
    console.log(err.message , '-- err delete open--');
    // PUT failed...
  });
}
