const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT || 80;

// server listening
server.listen(80, () => {
  console.log(`Server running on port 80`);
});
