module.exports = function(executedPositions = {}){
  if(executedPositions.currentQty > 0){
    return {
      type:'Buy',
      currentQty:executedPositions.currentQty
    }
  }else if(executedPositions.currentQty < 0){
    return {
      type:'Sell',
      currentQty:executedPositions.currentQty
    }
  }else{
    return null;
  }
}
