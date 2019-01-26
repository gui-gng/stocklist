export const loadStocks = (stocks) => {
    console.log("Search stocks:" + stocks.length);
    return ({
      type: 'LOAD_STOCKS',
      stocks
    })
  };
  