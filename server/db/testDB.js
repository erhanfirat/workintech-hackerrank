const knex = require("./knex");

const createTest = (test) =>
  knex("test").insert({ id: test.id, data: JSON.stringify(test) });

const getAllTests = () => knex("test").select("*");

const getTest = (testId) => knex("test").where("id", testId);

const updateTest = (test) =>
  knex("test")
    .where("id", test.id)
    .update({ id: test.id, data: JSON.stringify(test) });

const upsertTest = (test) => {
  const testRec = knex("test").where("id", test.id);
  if (testRec) {
    testRec.update({ id: test.id, data: JSON.stringify(test) });
  } else {
    knex("test").insert({ id: test.id, data: JSON.stringify(test) });
  }
};

const deleteTest = (testId) => knex("test").where("id", testId).del();

module.exports = {
  createTest,
  getAllTests,
  getTest,
  updateTest,
  deleteTest,
};
