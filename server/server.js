const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const testDB = require("./db/testDB");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Test Endpoints

app.get("/tests", async (req, res) => {
  const testsRec = await testDB.getAllTests();
  const tests = testsRec.map((tr) => JSON.parse(tr.data));
  res.status(200).json({ tests });
});

app.get("/tests/:id", async (req, res) => {
  const testRec = await testDB.getTest(req.params.id);
  const test = JSON.parse(testRec.data);
  res.status(200).json({ test });
});

app.post("/tests", async (req, res) => {
  const createResult = await testDB.createTest(req.body);
  res.status(201).json({ id: req.body.id });
});

app.put("/tests/:id", async (req, res) => {
  const updateResult = await testDB.updateTest(req.body);
  res.status(201).json({ id: req.body.id });
});

app.listen(3001);
