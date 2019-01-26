const express = require("express");
const router = express.Router();
const Stocks = require("../model/stocks");
const axios = require("axios");
const cheerio = require('cheerio'),
cheerioTableparser = require('cheerio-tableparser');


const stocksController = require('../controllers/stocks');


  
  router.get("/getStocks", stocksController.getStocks);
  
  router.post("/getStocks", stocksController.getStocksPost);
  
  router.get("/getStock", stocksController.getStock);
  
  router.get("/updateAllStock", stocksController.updateAllStocks);
  
  router.post("/updateStock", (req, res) => {
    var stockUpdate = req.body;
    var symbolSearch = stockUpdate.symbol;
    let stock = {};
    Stocks.findOne(stockUpdate, function (err, stockRes) {
      if(err){
        console.log(err);
      }
      stock = stockRes;
      axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbolSearch + "&outputsize=full&apikey=X8UIL9S4UQ8HJ7UP")
      .then(function (response) {
        var dataList = response.data["Time Series (Daily)"];
        for (var date in dataList) {
          
          var stockValue = {
            "Date": date,
            "open": dataList[date]["1. open"],
            "high": dataList[date]["2. high"],
            "low": dataList[date]["3. low"],
            "close": dataList[date]["4. close"],
            "volume": dataList[date]["5. volume"]
          };
          console.log(date);
          stock.data.push(stockValue);
        }
        //console.log(stock);
        Stocks.findOneAndUpdate(stockUpdate, stock, err => {
          if (err) return res.json({ success: false, error: err });
          return res.json({ success: true });
        });
      }).catch(function (error) {
        console.log(error);
      });
     
    });
  
  });
  
  
  
  router.get("/searchStock", stocksController.searchStock);
  
  router.get("/updateNews", (req, res) => {
    /*
    Add websites to search for news
      -Forbes 
      -The NYT
      -Guardian
      -Search some similar tool
  
    */
  });
  
  router.get("/Combinestocksnews", (req, res) => {
    /*
    Add websites to search for news
      -Forbes 
      -The NYT
      -Guardian
      -Search some similar tool
    */
   
  });
  
  
  router.get("/updateStocks", (req, res) => {
  
    var symbolList = [];
    axios.get("https://www.marketindex.com.au/asx-listed-companies")
    .then(function (response) {
      $ = cheerio.load(response.data);
      cheerioTableparser($);
      var data = $("#asx_sp_table").parsetable(true, true, true);
      var symbolListRes = data[2];
      if(symbolListRes){
        
        for (var name in symbolListRes) {
          var symbolNameFormated = symbolListRes[name].split(".")[0];
          if (symbolListRes.hasOwnProperty(name) && !symbolList.hasOwnProperty(symbolNameFormated)) { 
            symbolList.push(symbolNameFormated);
          }
        }
  
        let urlArray = [] // unknown # of urls (1 or more)
        for (var name in symbolList) {
          if (symbolList.hasOwnProperty(name)) { 
            //console.log(symbolList[name]);
            urlArray.push("https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + symbolList[name] + "&apikey=X8UIL9S4UQ8HJ7UP")
          }
        }
  
        var stockRes;
        var stock;
        var stockList = [];
        var urlArrayChucks = [];
  
  
        var i,j,temparray,chunk = 10;
        for (i=0,j=urlArray.length; i<j; i+=chunk) {
          temparray = urlArray.slice(i,i+chunk);
          arraySymbols.push(temparray);
        }
        executeChucksStocks(0);
      }
  })
  .catch(function (error) {
    console.log(error);
  });
  
  return res.json({ success: true});
  });
  
  router.get("/updateCurrency", (req, res) => {
    
    for(var i=0;i<350;i++) {
      //http://data.fixer.io/api/2018-01-03?access_key=0aec114be97caf2b2cd6678cc1b1732d
      var dateSelect = new Date('2018-01-01');
      console.log(dateSelect.toISOString().split('T')[0]);
      axios.get("http://data.fixer.io/api/" + dateSelect.toISOString().split('T')[0] + "?access_key=0aec114be97caf2b2cd6678cc1b1732d")
      .then(function (response) {
        console.log("---------------------------------------------------");
        console.log(response);
        console.log("---------------------------------------------------");
        let currency = new Currency();
        var currencyRes = response.data;
        currency.base = currencyRes.base;
        currency.date = currencyRes.date;
        currency.rates = new Array();
        for (var name in currencyRes.rates) {
          if (currencyRes.rates.hasOwnProperty(name)) {
            currency.rates.push({name: name, value: currencyRes.rates[name]});
          }
      }
      currency.save(err => {
        if (err) 
        console.log(err);
        //return res.json({ success: false, error: err });
        //return res.json({ success: true, data:currency  });
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  
    dateSelect.setDate(dateSelect.getDate() + 1);
    }
    return res.json({ success: true});
  });
  
 
  module.exports = router;