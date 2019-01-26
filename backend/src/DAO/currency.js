const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rateSchema = new Schema(
  {
    name: String,
    value: mongoose.Decimal128
  },
  { timestamps: false }
);

const DataSchema = new Schema(
    {
      base: String,
      date: String,
      rates: [rateSchema]
    },
    { timestamps: true }
  );




// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Currency", DataSchema);