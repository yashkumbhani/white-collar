const createOrder = require('./create-order');
const updateOpenOrder = require('./update-open-order');
const closePosition = require('./close-position');
const listPositions = require('./list-positions');
const deleteAllOpen = require('./delete-all-open');

module.exports = {
  createOrder:createOrder,
  updateOpenOrder:updateOpenOrder,
  closePosition:closePosition,
  listPositions:listPositions,
  deleteAllOpen:deleteAllOpen
}
