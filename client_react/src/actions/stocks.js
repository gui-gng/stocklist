export const loadStock = (stock) => {
  console.log("Action Stock:" + stock.symbol + "-" + stock.name);
  return ({
    type: 'LOAD_STOCK',
    stock
  })
};


