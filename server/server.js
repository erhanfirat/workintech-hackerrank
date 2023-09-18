const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const testDB = require("./db/testDB");
const candidateDB = require("./db/candidateDB");
const questionDB = require("./db/questionDB");
const groupDB = require("./db/groupDB");
const axios = require("axios");
const archiver = require("archiver");

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(express.json());

// Test Endpoints ****************************************

app.use((req, res, next) => {
  // Set the Access-Control-Expose-Headers header to expose additional headers to the client
  res.header("Access-Control-Expose-Headers", "Content-Disposition");

  // Allow cross-origin requests (CORS)
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Content-Disposition, Accept"
  );

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

// Candidate Endpoints ****************************************

app.get("/student/:studentId/results", async (req, res) => {
  try {
    const bodyData = req.body;
    const candidateId = req.params.candidateId;
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
    const candidates = await candidateDB.getAllCandidatesOfTest(testId);
    res.status(200).json({ testId, candidates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred", err });
  }
});

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
    const candidates = await candidateDB.getAllCandidatesOfTest(testId);
    res.status(200).json({ testId, candidates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred", err });
  }
});

app.post("/tests/:testId/candidates/:group/pdf", async (req, res) => {
  try {
    const pdfList = req.body;
    const testId = req.params.testId;
    const group = req.params.group;
    const testRecord = await testDB.getTest(testId);
    const test = JSON.parse(testRecord[0].data);

    const dateISO = new Date().toISOString();
    const testName = test.name.replace(/ /g, "_");
    const zipFilName = `${testName}_${group}_${dateISO.substring(
      0,
      dateISO.indexOf(".")
    )}.zip`;

    const archive = archiver("zip", { zlib: { level: 9 } });
    res.attachment(zipFilName);
    archive.pipe(res);

    for (const pdf of pdfList) {
      const response = await axios.get(pdf.url, { responseType: "stream" });
      const fileName = `${testName}_${group}_${pdf.candidate.substring(
        0,
        pdf.candidate.indexOf("@")
      )}.pdf`;

      archive.append(response.data, { name: fileName });
    }

    await archive.finalize();
  } catch (error) {
    console.error("Error downloading or creating zip:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Questions Endpoints ****************************************

/**
 * if comma seperated [ids] query parameters sent by it finds and returns founded questions
 * else it returns all questions
 */
app.get("/questions", async (req, res) => {
  try {
    const idList = req.query.ids.split(",");
    let questions = [];
    if (idList) {
      questions = await questionDB.getQuestionsByIdList(idList);
    } else {
      questions = await questionDB.getAllQuestions();
    }
    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred", err });
  }
});

app.post("/questions", async (req, res) => {
  try {
    const bodyData = req.body;
    if (bodyData instanceof Array) {
      for (let i = 0; i < bodyData.length; i++) {
        await questionDB.upsertQuestion(bodyData[i]);
      }
    } else {
      await questionDB.upsertQuestion(bodyData);
    }
    res.status(201).json(bodyData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Groups ************************************************

app.get("/group", async (req, res) => {
  try {
    const groups = await groupDB.getAllGroups();

    res.status(201).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
});

// JOURNEY: Login ****************************************

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const journeyRes = await axios.post("https://api.journeyapp.com/login", {
      Username: email,
      Password: password,
      LanguageCode: "tr",
    });
    res.status(201).json(journeyRes.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred", err });
  }
});

app.get("/verify/me", async (req, res) => {
  try {
    const Authorization = req.headers["authorization"];

    const journeyRes = await axios.get("https://api.journeyapp.com/user/me", {
      headers: {
        Authorization,
      },
    });

    res.status(201).json(journeyRes.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred", err });
  }
});

// APP STARTS ON 3001

app.listen(3001, () => {
  console.log("working on 3001");
});
