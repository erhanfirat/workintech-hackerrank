const knex = require("./knex");

const getAllTests = () => knex("test").select("*");

const getTest = (testId) => knex("test").where("id", testId);

const upsertTest = (test) => {
  return knex.transaction(
    async (trx) =>
      await trx("test")
        .insert({ id: test.id, data: JSON.stringify(test) })
        .onConflict("id")
        .merge()
  );
};

const deleteTest = (testId) => knex("test").where("id", testId).del();

module.exports = {
  upsertTest,
  getAllTests,
  getTest,
  deleteTest,
};
