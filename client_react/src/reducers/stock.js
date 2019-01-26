// Expenses Reducer

const stocksReducerDefaultState = {
    symbol:'CDM',
    name:'',
    type:'',
    region:'',
    marketOpen:'',
    marketClose:'',
    timezone:'',
    currency:'',
    data:[]
};

export default (state = stocksReducerDefaultState, action) => {
  switch (action.type) {
    case 'LOAD_STOCK':
      return  action.stock;
    default:
      return state;
  }
};
