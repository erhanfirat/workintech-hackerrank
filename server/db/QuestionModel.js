const knex = require("./knex");

const getAllQuestions = async () => {
  const questions = await knex("question").select("*");
  return questions.map((q) => ({
    id: q.id,
    ...JSON.parse(q.data),
  }));
};

const getQuestionsByIdList = async (idList) => {
  const questions = await knex("question").select().whereIn("id", idList);
  return questions.map((q) => ({
    id: q.id,
    ...JSON.parse(q.data),
  }));
};

const upsertQuestion = (question) => {
  return knex.transaction(
    async (trx) =>
      await trx("question")
        .insert({
          id: question.id,
          data: JSON.stringify(question),
        })
        .onConflict("id")
        .merge()
  );
};

const deleteQuestion = (questionId) =>
  knex("question").where("id", questionId).del();

module.exports = {
  upsertQuestion,
  getQuestionsByIdList,
  getAllQuestions,
  deleteQuestion,
};
