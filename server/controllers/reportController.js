const GroupTestInfo = require("../db/GroupTestInfoModel");
const Test = require("../db/TestModel");
const Candidate = require("../db/CandidateModel");

// Grup raporu getir
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
