const knex = require("./knex");

const getAllTests = () => knex("test").select("*");

const getTest = async (testId) => {
  const tests = await knex("test").where("id", testId);
  return tests.map((t) => ({ id: t.id, ...JSON.parse(t.data) }));
};

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
