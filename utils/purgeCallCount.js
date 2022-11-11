const express = require("express");
const app = express.Router();
const asyncMySQL = require("../utils/connection");

const { default: axios } = require("axios");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const apiKey = process.env.API_KEY;

function purgeCallCount() {
  asyncMySQL(`UPDATE apidata SET monthlycalls = 0;`);
}

module.exports = purgeCallCount;
