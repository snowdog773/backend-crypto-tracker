const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const dataFetcher = require("./utils/dataFetcher.js");

app.use("/getData", require("./routes/getData"));
app.use("/getApiKey", require("./routes/getApiKey"));

app.listen(process.env.PORT || 6001, () => {
  console.log("server running");
});
//hourly read and record of api currency data
setInterval(() => dataFetcher(), 3600000);
