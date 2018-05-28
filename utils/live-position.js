module.exports = function(executedPositions = {}){
  if(executedPositions.execSellQty> executedPositions.execBuyQty){
    return {
      type:'Buy',
      currentQty:executedPositions.currentQty
    }
  }else if(executedPositions.execSellQty < executedPositions.execBuyQty){
    return {
      type:'Sell',
      currentQty:executedPositions.currentQty
    }
  }else{
    return null;
  }
}
