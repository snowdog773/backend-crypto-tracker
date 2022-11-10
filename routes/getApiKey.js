const express = require("express");
const crypto = require("crypto");
const app = express.Router();
const asyncMySQL = require("../utils/connection");

app.post("/", async (req, res) => {
  try {
    const emailCheck = await asyncMySQL(
      `SELECT * FROM apidata WHERE Email = ?`,
      [req.body.email]
    );
    if (emailCheck[0]) {
      res.send("Email already in use");
    } else {
      const userNumber = await asyncMySQL(
        `SELECT * FROM apidata ORDER BY ID DESC LIMIT 1`,
        []
      );
      const random = crypto.randomBytes(15).toString("hex");
      const keydata = `${random}${userNumber[0].ID}`;
      await asyncMySQL(
        `INSERT INTO apidata (Name, Email, Apikey) VALUES (?,?,?)`,
        [req.body.name, req.body.email, keydata]
      );

      res.send(userNumber);
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = app;
