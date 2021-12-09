const dotenv = require("dotenv");
dotenv.config();

// Response for Uptime Robot
const http = require("http");
http
  .createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Discord bot is active now \n");
  })
  .listen(3000);

if (process.env.TOKEN == undefined) {
  console.error("tokenが設定されていません！");
  process.exit(0);
}

require("./bot.js");
