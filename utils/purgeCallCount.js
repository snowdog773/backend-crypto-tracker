const express = require("express");
const app = express.Router();
const asyncMySQL = require("../utils/connection");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

function purgeCallCount() {
  asyncMySQL(`UPDATE apidata SET monthlycalls = 0;`);
}

module.exports = purgeCallCount;
