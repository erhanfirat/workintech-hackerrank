const express = require("express");
const app = express();

app.get("/", (req, res, next) => {
  console.log("inside the request handler");
  res.statusCode(200);
  res.send({ pi: Math.PI });
});

app.listen(3001);
