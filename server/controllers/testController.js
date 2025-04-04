const Test = require("../db/TestModel");
const Candidate = require("../db/CandidateModel");
const GroupTestInfo = require("../db/GroupTestInfoModel");
const axios = require("axios");
const archiver = require("archiver");

// Tüm testleri getir
exports.getAllTests = async (req, res, next) => {
  try {
    const testsRec = await Test.getAllTests();
    const tests = testsRec.map((tr) => JSON.parse(tr.data));
    res.status(200).json(tests);
  } catch (err) {
    next(err);
  }
};

// Test ID'ye göre test getir
exports.getTestById = async (req, res, next) => {
  try {
    const testRec = await Test.getTestById(req.params.id);
    const test = JSON.parse(testRec.data);
    res.status(200).json(test);
  } catch (err) {
    next(err);
  }
};

// Yeni test oluştur veya güncelle
exports.createUpdateTest = async (req, res, next) => {
  try {
    const bodyData = req.body;
    if (Array.isArray(bodyData)) {
      for (let i = 0; i < bodyData.length; i++) {
        await Test.upsertTest(bodyData[i]);
      }
    } else {
      await Test.upsertTest(bodyData);
    }
    res.status(201).json(bodyData);
  } catch (err) {
    next(err);
  }
};

// Test güncelle
exports.updateTest = async (req, res, next) => {
  try {
    await Test.upsertTest(req.body);
    res.status(200).json({ id: req.body.id });
  } catch (err) {
    next(err);
  }
};

// Test ID'sine göre adayları getir
exports.getTestCandidates = async (req, res, next) => {
  try {
    const testId = req.params.testId;
    const candidates = await Candidate.getAllCandidatesOfTest(testId);
    res.status(200).json({ testId, candidates });
  } catch (err) {
    next(err);
  }
};

// Teste adayları ekle
exports.addCandidates = async (req, res, next) => {
  try {
    const bodyData = req.body;
    const testId = req.params.testId;
    if (Array.isArray(bodyData)) {
      for (let i = 0; i < bodyData.length; i++) {
        await Candidate.upsertCandidate(testId, bodyData[i]);
      }
    } else {
      await Candidate.upsertCandidate(testId, bodyData);
    }

    await updateGroupTestInfo(testId);
    res.status(201).json(bodyData);
  } catch (err) {
    next(err);
  }
};

// PDF oluştur ve indir
exports.createPdf = async (req, res, next) => {
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
  } catch (err) {
    next(err);
  }
};

// Gruplar için test bilgilerini güncelle - yardımcı fonksiyon
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

  for (const groupId in groups) {
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
    average_score:
      candidatesWithGroup.length > 0
        ? (
            candidatesWithGroup?.reduce(
              (sum, candidate) => sum + candidate.score,
              0
            ) / candidatesWithGroup.length
          ).toFixed(2)
        : "0.00",
    attendee_count: candidatesWithGroup.length,
    total_count: totalStudentCount,
  };

  await GroupTestInfo.upsertGroupTestInfo(testInfoForAllGroups);
};
