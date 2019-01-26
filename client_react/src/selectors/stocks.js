import axios from 'axios';
import { loadStock } from '../actions/stocks';
import { loadStocks } from '../actions/searchStocks';

const searchStock = (symbolRes, dispatch) => {

    const symbol = symbolRes.replace('_','.');
    console.log("Selector symbol:" + symbol);
    dispatch(loadStock({ symbol }));
    
    return axios.get("http://localhost:3001/api/getStock?symbol=" + symbol)
        .then((results) => {
            console.log("Result SearchStock");
            console.log(results.data.data);
            let stockRes = results.data.data;
            //console.log(stockRes);
            stockRes.data = stockRes.data.map((_data) => {
                if(_data.open === 0){
                  return;
                }
                  
                  let _dataR = {
                    "Date": _data.Date,
                    "open": _data.open.$numberDecimal,
                    "high": _data.high.$numberDecimal,
                    "low": _data.low.$numberDecimal,
                    "close": _data.close.$numberDecimal,
                    "volume": _data.volume,
                  }
                  return _dataR;
                
              });
              //console.log(stockRes);

            if (stockRes) {
                dispatch(loadStock(stockRes));
            }
        }).catch(function (error) {
            console.log(error);
        });
};



const searchStocks = (symbol, dispatch) => {
    console.log("Selector symbol:" + symbol);

    return axios.get("http://localhost:3001/api/searchStock?searchTxt=" + symbol)
        .then((results) => {
            console.log(results.data);
            const stocks = results.data;
            if (stocks) {
                dispatch(loadStocks(stocks));
            }
        }).catch(function (error) {
            console.log(error);
        });
}


export { searchStock, searchStocks };