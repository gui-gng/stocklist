const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const StockData = new Schema(
    {
        "Date": String,
        "open": mongoose.Decimal128,
        "high": mongoose.Decimal128,
        "low": mongoose.Decimal128,
        "close": mongoose.Decimal128,
        "volume": Number
    },
    { timestamps: true }
  );



const Stocks = new Schema(
    {
        "symbol": String,
        "name": String,
        "type": String,
        "region": String,
        "marketOpen": String,
        "marketClose": String,
        "timezone": String,
        "currency": String,
        "data": [StockData]
    },
    { timestamps: true }
  );


// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Stocks", Stocks);