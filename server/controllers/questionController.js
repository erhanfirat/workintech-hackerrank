const Question = require("../db/QuestionModel");

// Soruları getir - ID listesine göre veya tümünü
exports.getQuestions = async (req, res, next) => {
  try {
    let questions = [];
    if (req.query.ids) {
      const idList = req.query.ids.split(",");
      questions = await Question.getQuestionsByIdList(idList);
    } else {
      questions = await Question.getAllQuestions();
    }
    res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
};

// Soru oluştur veya güncelle
exports.createUpdateQuestions = async (req, res, next) => {
  try {
    const bodyData = req.body;
    if (Array.isArray(bodyData)) {
      for (let i = 0; i < bodyData.length; i++) {
        await Question.upsertQuestion(bodyData[i]);
      }
    } else {
      await Question.upsertQuestion(bodyData);
    }
    res.status(201).json(bodyData);
  } catch (err) {
    next(err);
  }
};
