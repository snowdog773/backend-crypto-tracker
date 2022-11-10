const express = require("express");
const app = express.Router();
const asyncMySQL = require("../utils/connection");

app.get("/", async (req, res) => {
  let currencyType = "";
  req.query.currency
    ? (currencyType = req.query.currency)
    : (currencyType = "*");
  let startDate = 0;
  req.query.start ? (startDate = req.query.start) : (startDate = 0);
  let endDate = 0;
  req.query.end ? (endDate = req.query.end) : (endDate = Date.now());
  const charCheck = RegExp(
    /^(?!s*$)(?:GBP|USD|EUR|BTC|ETH|USDT|BNB|XRP|,|\*)+$/gm
  );
  if (currencyType.match(charCheck)) {
    const apiCheck = await asyncMySQL(
      `SELECT * FROM apidata WHERE Apikey = ?`,
      [req.query.key]
    );
    if (apiCheck[0]) {
      try {
        const results = await asyncMySQL(
          `SELECT ${currencyType}, unixtimestamp FROM currencydata WHERE currencydata.unixtimestamp BETWEEN ? AND ?`,
          [startDate, endDate]
        );
        res.send(results);
      } catch (error) {
        res.send(error);
      }
    } else {
      res.send("API key not recognised");
    }
  } else {
    res.send("BAD QUERY");
    console.log(req);
  }
});

module.exports = app;
