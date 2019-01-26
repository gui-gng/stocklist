// Expenses Reducer

const stocksReducerDefaultState = {
    stocks: []
};

export default (state = stocksReducerDefaultState, action) => {
  switch (action.type) {
    case 'LOAD_STOCKS':
    if(action.stocks){
      console.log("Reducer stocks length: " + action.stocks.length);
      return  action.stocks;
    } else {
      return null;
    }
    default:
      return state;
  }
};
