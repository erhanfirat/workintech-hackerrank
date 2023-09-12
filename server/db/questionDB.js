const knex = require("./knex");

const getAllQuestions = () => knex("question").select("*");

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
  getAllQuestions,
  deleteQuestion,
};
