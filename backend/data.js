const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
    {
      id: Number,
      message: String,
      base: String,
      date: Date
    },
    { timestamps: true }
  );


// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);