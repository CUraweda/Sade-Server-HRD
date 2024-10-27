const app = require("./app");
const config = require("./config/config");

require("./cronJobs");

// const https = require("https");
const http = require("http");
const fs = require("fs");

// var key = fs.readFileSync("./certs/sade.key");
// var cert = fs.readFileSync("./certs/sade.crt");
// var options = {
//   key: key,
//   cert: cert,
// }

const server = http.createServer(app);
server.listen(config.port, () => {
  console.log("SERVER");
  console.log(`Listening to port ${config.port}`);
});
