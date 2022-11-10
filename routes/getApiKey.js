const express = require("express");
const crypto = require("crypto");
const app = express.Router();
const nodemailer = require("nodemailer");
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
      const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: 465,
        auth: {
          user: process.env.EMAILUSER,
          pass: process.env.EMAILPASS,
        },

        secure: true,
        tls: { rejectUnauthorized: false },
        //only for cheap servers like host presto with no authentication
      });

      const mailOptions = {
        from: "Noreply@pitans.co.uk",
        to: req.body.email,
        subject: "Your API Key from Pitans.co.uk",
        text: `Thanks for signing up for my cryptocurrency tracking service. Your API key is ${keydata} 
          Please visit my portfolio site https://jon.pitans.co.uk`,
      };
      transporter.sendMail(mailOptions, (error, response) =>
        console.log(error, response)
      );

      res.send("Your API key has been emailed to you");
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = app;
