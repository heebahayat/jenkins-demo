const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");

const appPath = process.env.APP_PATH
  ? path.resolve(process.env.APP_PATH)
  : path.join(__dirname, "..", "app.js");
const { createServer, loadConfig } = require(appPath);

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.removeListener("error", reject);
      resolve(server.address().port);
    });
  });
}

function get(port, route) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: "127.0.0.1", port, path: route }, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => resolve({ status: response.statusCode, body }));
      })
      .on("error", reject);
  });
}

test("server.json has valid server settings", () => {
  const config = loadConfig();
  assert.equal(typeof config.host, "string");
  assert.ok(Number.isInteger(config.port));
  assert.ok(config.message.length > 0);
});

test("server responds with the configured message and returns 404 for unknown paths", async (t) => {
  const config = loadConfig();
  const server = createServer(config);
  const port = await listen(server);
  t.after(() => new Promise((resolve) => server.close(resolve)));

  assert.deepEqual(await get(port, "/"), {
    status: 200,
    body: config.message,
  });
  assert.deepEqual(await get(port, "/missing"), {
    status: 404,
    body: "Not found",
  });
});
