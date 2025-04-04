const Group = require("../db/GroupModel");
const GroupTestInfo = require("../db/GroupTestInfoModel");
const Test = require("../db/TestModel");
const Candidate = require("../db/CandidateModel");
const Student = require("../db/StudentModel");
const HrEmail = require("../db/HrEmailModel");
const Motivation = require("../db/MotivationModel");
const { sendEmail } = require("../utils/utils");

// Tüm grupları getir
exports.getAllGroups = async (req, res, next) => {
  try {
    const groups = await Group.getAllGroups();
    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
};

// Grup test bilgisini getir
exports.getGroupTestInfo = async (req, res, next) => {
  try {
    const groupTestInfo = await GroupTestInfo.getAllGroupTestInfo();
    res.status(200).json(groupTestInfo);
  } catch (err) {
    next(err);
  }
};

// Grup raporlarını getir
exports.getGroupReport = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const groupTestInfos = await GroupTestInfo.getGroupTestInfo(groupId);
    const testIdList = groupTestInfos.map((gt) => gt.test_id);
    const tests = await Test.getTestsByIdList(testIdList);

    let results = {};
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      results[test.id] = await Candidate.getAllCandidateWithStudentByTestId(
        test.id
      );
    }

    res.status(200).json({ groupId, groupTestInfos, tests, results });
  } catch (err) {
    next(err);
  }
};

// Öğrencinin HR e-postasını ayarla
exports.setStudentHrEmail = async (req, res, next) => {
  try {
    const hrStudent = req.body;
    if (hrStudent.email) {
      await HrEmail.upsertHrEmail(hrStudent);
    } else {
      await HrEmail.deleteHrEmail(hrStudent.student);
    }
    res.status(200).json(true);
  } catch (err) {
    next(err);
  }
};

// Sınava girmeyen öğrencilere hatırlatma e-postası gönder
exports.remindHrExamToGroup = async (req, res, next) => {
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

    res.status(200).json(true);
  } catch (err) {
    next(err);
  }
};
