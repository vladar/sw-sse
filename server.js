const express = require("express");
const app = express();

app.use("/example", express.static("."));

app.listen(8082);

console.log("Listening on port 8082. http://localhost:8082/example/");
