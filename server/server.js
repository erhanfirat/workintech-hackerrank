const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const testDB = require("./db/testDB");
const candidateDB = require("./db/candidateDB");

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(express.json());

// Test Endpoints

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get("/tests", async (req, res) => {
  try {
    const testsRec = await testDB.getAllTests();
    const tests = testsRec.map((tr) => JSON.parse(tr.data));
    res.status(200).json(tests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred", err });
  }
});

app.get("/tests/:id", async (req, res) => {
  try {
    const testRec = await testDB.getTest(req.params.id);
    const test = JSON.parse(testRec.data);
    res.status(200).json(test);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred", err });
  }
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
    res.status(201).json(bodyData);
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

// Candidate Endpoints

app.post("/tests/:testId/candidates", async (req, res) => {
  try {
    const bodyData = req.body;
    const testId = req.params.testId;
    if (bodyData instanceof Array) {
      for (let i = 0; i < bodyData.length; i++) {
        await candidateDB.upsertCandidate(testId, bodyData[i]);
      }
    } else {
      await candidateDB.upsertCandidate(testId, bodyData);
    }
    res.status(201).json(bodyData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/tests/:testId/candidates", async (req, res) => {
  try {
    const testId = req.params.testId;
    const candidates = await candidateDB.getAllCandidatesOfTest(
      req.params.testId
    );
    res.status(200).json({ testId, candidates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred", err });
  }
});

// APP STARTS ON 3001

app.listen(3001, () => {
  console.log("working on 3001");
});
