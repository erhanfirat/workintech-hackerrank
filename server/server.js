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

const upsertTest = async (test) => {
  const rec = await testDB.where("id", test.id);
  if (rec) {
    testDB.updateTest(test);
  } else {
    testDB.createTest(test);
  }
};

app.post("/tests", async (req, res) => {
  const bodyData = req.body;
  if (bodyData instanceof Array) {
    for (let i = 0; i < bodyData.length; i++) {
      await upsertTest(bodyData[i]);
    }
  } else {
    await upsertTest(bodyData);
  }
  res.status(201).json({ id: req.body.id });
});

app.put("/tests/:id", async (req, res) => {
  const updateResult = await testDB.updateTest(req.body);
  res.status(201).json({ id: req.body.id });
});

app.listen(3001);
