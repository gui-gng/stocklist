const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const Currency = require("./currency");
const Stocks = require("./stocks");
const axios = require("axios");
var cheerio = require('cheerio'),
cheerioTableparser = require('cheerio-tableparser');

const API_PORT = 3001;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb://guigng:1Metallica@ds247759.mlab.com:47759/currency";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

async function  executeChucksStocks(urlArray){
  
  var dateNow = Date.now();
  console.log(dateNow + ": Executing: " + urlArray[0] + " to " + urlArray[urlArray.length-1]);
  let promiseArray = urlArray.map(url => axios.get(url)); // or whatever

    return await axios.all(promiseArray)
    .then(function(results) {
      results.forEach(function(response) {
        stockRes = response.data.bestMatches;
        var stockValue = {
          "Date": "",
          "open": "0",
          "high": "0",
          "low": "0",
          "close": "0",
          "volume": "0"};
        if(stockRes){

          for(var i=0; i < stockRes.length;i++){
            let stock = new Stocks();
            stock.symbol =  stockRes[i]["1. symbol"];
            stock.name =    stockRes[i]["2. name"];
            stock.type =    stockRes[i]["3. type"];
            stock.region =  stockRes[i]["4. region"];
            stock.marketOpen = stockRes[i]["5. marketOpen"];
            stock.marketClose = stockRes[i]["6. marketClose"];
            stock.timezone = stockRes[i]["7. timezone"];
            stock.currency = stockRes[i]["8. currency"];
            stock.data[0] = stockValue;
            console.log("Symbol: " + stock.symbol);
            stock.save(err => {
              if (err) 
              console.log(err);
            });
          }
        }
      });
    });
}

router.get("/updateStocks", (req, res) => {

  var symbolList = [];
  axios.get("https://www.marketindex.com.au/asx-listed-companies")
  .then(function (response) {
    $ = cheerio.load(response.data);
 
    cheerioTableparser($);
    var data = $("#asx_sp_table").parsetable(true, true, true);
    //console.log(data[2]);
    var symbolListRes = data[2];
    //console.log("sizeList: " + symbolListRes[name].length);
    if(symbolListRes){
      let urlArray = [] // unknown # of urls (1 or more)
      for (var name in symbolListRes) {
        if (symbolListRes.hasOwnProperty(name)) { 
          console.log(symbolListRes[name].split(".")[0]);
          urlArray.push("https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + symbolListRes[name].split(".")[0] + "&apikey=X8UIL9S4UQ8HJ7UP")
        }
      }

      var stockRes;
      var stock;
      var stockList = [];
      var urlArrayChucks = [];
      var i,j,temparray,chunk = 10;
      for (i=0,j=urlArray.length; i<j; i+=chunk) {
        temparray = urlArray.slice(i,i+chunk);
        executeChucksStocks(temparray);
      } 
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


// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();
  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));