exports.findStock = (req, res, next) => {

}

exports.searchStock = (req, res, next) => {
    const searchTxt = req.query.searchTxt;
  
    Stocks.find({symbol: { $regex: '.*' + searchTxt + '.*' }}, (err,resStock) => {
      const stocksDetails = [];
      resStock.slice(1, 10).forEach((stock) => {
        let stockFormat = {
          symbol:stock.symbol,
          name:stock.name,
          // type:stock.type,
          // region:stock.region,
          // marketOpen:stock.marketOpen,
          // marketClose:stock.marketClose,
          // timezone:stock.timezone,
          // currency:stock.currency
        };
        stocksDetails.push(stockFormat);
      });
      res.header({'Access-Control-Allow-Origin': "*"});
      res.send(stocksDetails);
    });
    //res.send(req.query);
  }


  var arraySymbols = [];
  
  function  executeChucksStocks(position){
    var urlArray = arraySymbols[position];
    var dateNow = Date.now();
    //console.log(dateNow + ": Executing: " + urlArray[0] + " to " + urlArray[urlArray.length-1]);
    let promiseArray = urlArray.map(url => axios.get(url)); // or whatever
  
    axios.all(promiseArray)
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
              /*
              axios.post("/api/updateStock", {
                symbol: stock.symbol
              });
              */
            }
           
          }
        });
      }).catch(function (error) {
        console.log("error");
      }).then(function(){
        console.log("Starting array: " + position);
        return  setTimeout(executeChucksStocks, 10000, position+1);
        ;
      });
  }
  


  exports.updateAllStocks = (req, res) => {
    var listSymbol = "<table><tr><th>Symbol</th><th>CountData</th><th>Checked</th></tr>";
    Stocks.find({}, function(err, stocks){
      stocks.forEach(function(stock) {
        console.log(stock.symbol);
        listSymbol =  listSymbol.concat(
          "<tr><td>" + stock.symbol + "</td>"  +
          "<td>" + stock.data.length + "</td>"  +
          "<td>" + stock.type + "</td>"  +
          "</tr>");
          //axios.post("http://localhost:3001/api/updateStock", {symbol: stock.symbol});
      });
  
      listSymbol =  listSymbol.concat("</table>");
      res.send(listSymbol);
    }); 
  }


  exports.getStock = (req, res) => {
  
    Stocks.findOne({symbol: req.query.symbol}, (err, data) => {
      //console.log(data);
      res.header({'Access-Control-Allow-Origin': "*"});
      if (err) {
        return res.json({ success: false, error: err });
      } else {
        return res.json({ success: true, data: data });
      }
    });
  }


  exports.getStocks = (req, res) => {
    Stocks.find(req.body, (err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data });
    });
  }


  exports.getStocksPost = (req, res) => {
    Stocks.find(req.body, (err, data) => {
      //console.log(data);
      res.header({'Access-Control-Allow-Origin': "*"});
      if (err) {
        return res.json({ success: false, error: err });
      } else {
        return res.json({ success: true, data: data });
      }
    });
  }