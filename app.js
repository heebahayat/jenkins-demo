const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

function loadConfig(configPath = path.join(__dirname, "server.json")) {
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  if (
    typeof config.host !== "string" ||
    !Number.isInteger(config.port) ||
    config.port < 0 ||
    config.port > 65535 ||
    typeof config.message !== "string" ||
    config.message.length === 0
  ) {
    throw new Error("server.json must define a host, valid port, and non-empty message");
  }

  return config;
}

function createServer(config = loadConfig()) {
  return http.createServer((request, response) => {
    if (request.url !== "/") {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(config.message);
  });
}

if (require.main === module) {
  const config = loadConfig();
  const server = createServer(config);
  server.listen(config.port, config.host, () => {
    console.log(`Server listening at http://${config.host}:${config.port}`);
  });
}

module.exports = { createServer, loadConfig };
