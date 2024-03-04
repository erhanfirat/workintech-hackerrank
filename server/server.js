const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const archiver = require("archiver");
const pdf = require("pdf-parse");

// Models
const Test = require("./db/TestModel");
const Candidate = require("./db/CandidateModel");
const Question = require("./db/QuestionModel");
const Group = require("./db/GroupModel");
const Student = require("./db/StudentModel");
const HrEmail = require("./db/HrEmailModel");
const GroupTestInfo = require("./db/GroupTestInfoModel");
const Motivation = require("./db/MotivationModel");

require("dotenv").config();
const JOURNEY = process.env.JOURNEY_ENDPOINT;

// Utils
const {
  generateReadableTitleByGroupName,
  sendEmail,
} = require("./utils/utils");

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
    const testsRec = await Test.getAllTests();
    const tests = testsRec.map((tr) => JSON.parse(tr.data));
    res.status(200).json(tests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred", err });
  }
});

app.get("/tests/:id", async (req, res) => {
  try {
    const testRec = await Test.getTestById(req.params.id);
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
        await Test.upsertTest(bodyData[i]);
      }
    } else {
      await Test.upsertTest(bodyData);
    }
    res.status(201).json(bodyData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put("/tests/:id", async (req, res) => {
  try {
    const updateResult = await Test.upsertTest(req.body);
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
        await Candidate.upsertCandidate(testId, bodyData[i]);
      }
    } else {
      await Candidate.upsertCandidate(testId, bodyData);
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
    const candidates = await Candidate.getAllCandidatesOfTest(testId);
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
        await Candidate.upsertCandidate(testId, bodyData[i]);
      }
    } else {
      await Candidate.upsertCandidate(testId, bodyData);
    }

    updateGroupTestInfo(testId);

    res.status(201).json(bodyData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

const updateGroupTestInfo = async (testId) => {
  const candidates = await Candidate.getAllCandidateWithStudentByTestId(testId);
  const groups = {}; // group tabanlı ortalamalar için

  candidates.forEach((candidate) => {
    if (candidate.group_id) {
      if (!groups[candidate.group_id]) {
        groups[candidate.group_id] = [];
      }
      groups[candidate.group_id].push(candidate);
    }
  });
  let totalStudentCount = 0;

  for (groupId in groups) {
    const group = await Group.getGroupById(groupId);
    if (groupId && groupId !== "null" && group) {
      totalStudentCount += group.user_count;
      const newGroupTestInfo = {
        group_id: groupId,
        test_id: testId,
        average_score: groups[groupId]
          ? (
              groups[groupId]?.reduce(
                (sum, candidate) => sum + candidate.score,
                0
              ) / groups[groupId]?.length
            ).toFixed(2)
          : 0,
        attendee_count: groups[groupId]?.length || 0,
        total_count: group.user_count,
      };
      await GroupTestInfo.upsertGroupTestInfo(newGroupTestInfo);
    }
  }

  const candidatesWithGroup = candidates.filter((c) => c.group_id);

  // test tabanlı tüm katılımcıların ortalamaları için
  const testInfoForAllGroups = {
    test_id: testId,
    group_id: "all",
    average_score: (
      candidatesWithGroup?.reduce(
        (sum, candidate) => sum + candidate.score,
        0
      ) / candidatesWithGroup.length
    ).toFixed(2),
    attendee_count: candidatesWithGroup.length,
    total_count: totalStudentCount,
  };

  await GroupTestInfo.upsertGroupTestInfo(testInfoForAllGroups);
};

app.get("/tests/:testId/candidates", async (req, res) => {
  try {
    const testId = req.params.testId;
    const candidates = await Candidate.getAllCandidatesOfTest(testId);
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
    const test = await Test.getTestById(testId);

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

app.post("/candidate/send/report", async (req, res) => {
  try {
    const reports = req.body;
    const results = [];
    for (let i = 0; i < reports.length; i++) {
      const { url, studentId, testId } = reports[i];

      // Download the PDF from the URL
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const pdfBuffer = Buffer.from(response.data);

      const student = await Student.getStudentById(studentId);
      const test = await Test.getTestById(testId);
      const motivation = await Motivation.getMotivation();

      // Parse the PDF
      const data = await pdf(pdfBuffer);

      if (student && test) {
        // Create an attachment
        const attachment = {
          filename: `${test.name} - ${student.name}.pdf`,
          content: pdfBuffer,
        };

        const subject = `${test.name} Sınav Değerlendirme Raporun Hazır!`;
        const content = `
<div style="font-size: 18px;">
  <p>Merhaba <strong>${student.name};</strong></p>

  <p>
    <strong>${test.name}</strong> sınav değerlendirme PDF dosyası maile eklenmiştir.
    Bu rapor doğru ve hatalı cevaplarını inceleyip, hatalarını tespit edip, bilgilerini tazelemek için mükemmel bir fırsat.
  </p>

  Workintech <br />
  Hackerrank Ekibi

  <blockquote style="padding-top: 30px;">
    <q>${motivation.word}</q>
    <br />
    ${motivation.author}
  </blockquote>
</div>
`;

        // Send the email
        await sendEmail(student.hrEmail || student.email, subject, content, [
          attachment,
        ]);

        results.push(
          `PDF Email sent to ${student.name} | ${
            student.hrEmail || student.email
          }`
        );
      } else {
        // no student or test
        console.error(
          "There is no student or test record related to this candidate: ",
          { studentId, testId },
          student
        );
        results.push(
          `There is no student or test record related to this studentId: ${studentId} && testId: ${testId} > student: ${JSON.stringify(
            student
          )} && test: ${JSON.stringify(test)}`
        );
      }
    }

    res.json({
      message:
        "PDF downloaded and email sent process completed successfully. Please check results report for each students in the list! Some of them may have problems!",
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error downloading PDF or sending email" });
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
      questions = await Question.getQuestionsByIdList(idList);
    } else {
      questions = await Question.getAllQuestions();
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
        await Question.upsertQuestion(bodyData[i]);
      }
    } else {
      await Question.upsertQuestion(bodyData);
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
    const groups = await Group.getAllGroups();

    res.status(201).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
});

app.get("/group-test-info", async (req, res) => {
  try {
    const groupTestInfo = await GroupTestInfo.getAllGroupTestInfo();

    res.status(201).json(groupTestInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
});

app.get("/student", async (req, res) => {
  try {
    const students = await Student.getAllStudents();

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
});

app.get("/motivation", async (req, res) => {
  try {
    const aww = await new Promise((resolve) => setTimeout(resolve, 3000));
    const motivation = await Motivation.getMotivation();

    res.status(200).json(motivation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
});

app.post("/set-student-hr-email", async (req, res) => {
  try {
    const hrStudent = req.body;
    if (hrStudent.email) {
      const upsertRes = await HrEmail.upsertHrEmail(hrStudent);
    } else {
      const deleteRes = await HrEmail.deleteHrEmail(hrStudent.student);
    }

    res.status(201).json(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
});

app.post("/remind-hr-exam-to-group", async (req, res) => {
  try {
    const { testId, groupId } = req.body;

    const candidates = await Candidate.getAllCandidatesOfTest(testId);
    const students = await Student.getStudentsByGroupId(groupId);
    const test = await Test.getTestById(testId);
    const motivation = await Motivation.getMotivation();

    const nonAttendees = students.filter(
      (s) => !candidates.find((c) => c.student_id === s.id)
    );

    const subject = `${test.name} Hatırlatıcı!`;

    nonAttendees.forEach((nonAttendee) => {
      const content = `
<div style="font-size: 18px;">
  <p>Merhaba <strong>${nonAttendee.name};</strong></p>

  <p>
    Workintech eğitimi içindeki çabanı ve gelişimi görüyor takdir ediyoruz.
    Gelişiminin sağlıklı bir şekilde ilerlemesi adına ve iş arama sürecini kolaylaştıracak Hackerrank Sınavlarımızdan
    ${test.name} sınavına girmediğini tespit ettik.
  </p>

  <p>
    Eğitmeninle iletişime geçip sınava giriş yapabilmen için gerekli izinleri alabilirsin.
  </p>

  Workintech <br />
  Hackerrank Ekibi

  <blockquote style="padding-top: 30px;">
    <q>${motivation.word}</q>
    <br />
    ${motivation.author}
  </blockquote>
</div>
`;

      sendEmail(nonAttendee.hrEmail || nonAttendee.email, subject, content);
    });

    res.status(201).json(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
});

// JOURNEY: Login ****************************************

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const journeyRes = await axios.post(`${JOURNEY}/login`, {
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

    const journeyRes = await axios.get(`${JOURNEY}/user/me`, {
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

app.post("/fetch-groups-and-users", async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminLoginRes = await axios.post(`${JOURNEY}/api/auth/login`, {
      email: "admin@workintech.com.tr",
      password: "GQ1qfFAKpInI6UoOKWB**@",
    });
    const authorization = `Bearer ${adminLoginRes.data.token}`;

    const groupsRes = await axios.get(
      `${JOURNEY}/api/usergroup/datatables?per_page=1000&search=fsweb`,
      { headers: { authorization } }
    );

    const groups = groupsRes.data.data.filter(
      (g) => !g.name.toLowerCase().includes("prework")
    );

    const students = {};

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      group.name = group.name.trim();
      group.title = generateReadableTitleByGroupName(group.name);
      delete group.for_dropdown;

      const activeSprintRes = await axios.get(
        `${JOURNEY}/api/usergroup/journey/${group.id}?per_page=1000`,
        {
          headers: {
            authorization,
          },
        }
      );
      group.active_sprint = activeSprintRes.data.to - 1;

      const studentsRes = await axios.get(
        `${JOURNEY}/api/usergroup/user/datatables/${group.id}?per_page=1000`,
        {
          headers: {
            authorization,
          },
        }
      );
      students[group.id] = studentsRes.data.data;

      await Group.upsertGroup(group);

      for (let j = 0; j < studentsRes.data.data.length; j++) {
        const student = studentsRes.data.data[j];
        student.group_id = group.id;
        await Student.upsertStudent(student);
      }
    }

    res.status(201).json({ groups, students });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred", err });
  }
});

// APP STARTS ON 3001

app.listen(3380, () => {
  console.log("working on 3380");
});
