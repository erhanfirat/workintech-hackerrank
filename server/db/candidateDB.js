const knex = require("./knex");

const getAllCandidatesOfTest = (testId) =>
  knex("candidate").select("*").where("test", testId);

const upsertCandidate = (testId, candidate) => {
  return knex.transaction(
    async (trx) =>
      await trx("candidate")
        .insert({
          id: candidate.id,
          test: testId,
          data: JSON.stringify(candidate),
        })
        .onConflict("id")
        .merge()
  );
};

const deleteCandidate = (testId) => knex("candidate").where("id", testId).del();

module.exports = {
  upsertCandidate,
  getAllCandidatesOfTest,
  deleteCandidate,
};
