const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const testDB = require("./db/testDB");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Test Endpoints

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

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
  try {
    const bodyData = req.body;
    if (bodyData instanceof Array) {
      for (let i = 0; i < bodyData.length; i++) {
        await testDB.upsertTest(bodyData[i]);
      }
    } else {
      await testDB.upsertTest(bodyData);
    }
    res.status(201).json({ id: req.body.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put("/tests/:id", async (req, res) => {
  try {
    const updateResult = await testDB.upsertTest(req.body);
    res.status(201).json({ id: req.body.id });
  } catch (err) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(3001, () => {
  console.log("working on 3001");
});
