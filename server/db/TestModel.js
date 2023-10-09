const knex = require("./knex");

const getAllTests = () => knex("test").select("*");

const getTestById = async (testId) => {
  const test = await knex("test").where("id", testId).first();
  return { id: test.id, ...JSON.parse(test.data) };
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
  getTestById,
  deleteTest,
};
