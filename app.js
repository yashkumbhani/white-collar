require('dotenv').config();
const BitMEXClient = require('bitmex-realtime-api');

const operations = require('./operations');
const stratergies = require('./stratergies');
const decider = require('./decider');


const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

// See 'options' reference below
const client = new BitMEXClient({
  testnet: false,
  apiKeyID: apiKey,
  apiKeySecret: apiSecret,
  maxTableLen: 10000 // the maximum number of table elements to keep in memory (FIFO queue)
});

let counter = 0;
let myPreviousOrder = {}
let previousQuote = {}

client.addStream('XBTUSD', 'instrument', async function (data, symbol, tableName) {
  if (!data.length) return;
  const quote = data[data.length - 1];
  let currentQuote = {};
  counter ++;
  if(counter % 25 == 0){
      currentQuote = {
        fairPrice: quote.fairPrice,
        markPrice: quote.lastPrice,
        lowPrice: quote.lowPrice,
        lastPrice: quote.lastPrice,
        quoteCurrency:quote.quoteCurrency
      }
      counter = 1;
      const preQuote = Object.assign({},previousQuote);
      await decider(myPreviousOrder, currentQuote, preQuote);
      previousQuote = currentQuote;
  }
});


// the last data element is the newest quote
// Do something with the quote (.bidPrice, .bidSize, .askPrice, .askSize)

client.on('initialize', () => {
  console.log(' -- client initialize--'); // Log .public, .private and .all stream names
});

client.on('error', (e) => {
  console.log(e, '---- error on the client ---');
});

client.on('open', () => {
  console.log('---- client opened---');
});

client.on('close', () => {
  console.log('---- client closed---');
});
