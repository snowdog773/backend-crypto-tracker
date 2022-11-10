const express = require("express");
const app = express.Router();
const asyncMySQL = require("../utils/connection");

const { default: axios } = require("axios");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const apiKey = process.env.API_KEY;

function dataFetcher() {
  axios
    .get(
      `https://marketdata.tradermade.com/api/v1/live?currency=BTCGBP,BTCUSD,BTCEUR,ETHGBP,ETHUSD,ETHEUR,USDTGBP,USDTUSD,USDTEUR,BNBGBP,BNBUSD,BNBEUR,XRPGBP,XRPUSD,XRPEUR&api_key=${apiKey}`
    )
    .then((response) => {
      const results = response.data.quotes.map((e) => e.mid);
      //results is an array of all 15 currency values returned so can be plugged
      //directly into the asyncSQL function
      const timestamp = Date.now();
      console.log(timestamp);
      asyncMySQL(
        `INSERT INTO currencydata (BTCGBP, BTCUSD, BTCEUR, ETHGBP, ETHUSD, ETHEUR, USDTGBP, USDTUSD, USDTEUR, BNBGBP, BNBUSD, BNBEUR, XRPGBP, XRPUSD, XRPEUR, unixtimestamp)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
        [...results, timestamp]
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = dataFetcher;
