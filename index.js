const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const app = express();

app.use(express.json());
app.use(cors());

const dataFetcher = require("./utils/dataFetcher.js");
const purgeCallCount = require("./utils/purgeCallCount.js");

app.use("/getData", require("./routes/getData"));
app.use("/getApiKey", require("./routes/getApiKey"));

app.listen(process.env.PORT || 6001, () => {
  console.log("server running");
});
//hourly read and record of api currency data

cron.schedule("0 * * * *", function () {
  dataFetcher();
  console.log("data fetcher ran");
});

//monthly purge of api callcount
cron.schedule("0 0 1 * *", function () {
  purgeCallCount();
  console.log("api purge ran");
});

process.on("uncaughtException", (err) => {
  console.log("uncaughtException", err);
  // attempt a gracefully shutdown
  server.close(() => {
    process.exit(1); // then exit
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("unhandledRejection", reason);

  server.close(() => {
    process.exit(1);
  });
});

function stop() {
  // Run some code to clean things up before server exits or restarts
  // console.log("stopping timer");
  // clearInterval(hourTimer); // THAT KILLS THE TIMER
  console.log("⬇ Killing process");
  process.exit(); // THEN EXITS THE PROCESS.
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
process.on("SIGQUIT", stop);

process.once("SIGUSR2", function () {
  // Run some code to do a different kind of cleanup on nodemon restart:
  process.kill(process.pid, "SIGUSR2");
});
