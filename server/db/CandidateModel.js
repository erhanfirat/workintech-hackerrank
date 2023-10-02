const knex = require("./knex");
const Students = require("./StudentModel");

const getAllCandidatesOfTest = async (testId) => {
  const candidates = await knex("candidate")
    .select("*")
    .where("test_id", testId);
  return candidates.map((c) => {
    const { data, ...candidate } = c;
    return { ...candidate, ...JSON.parse(c.data) };
  });
};

const upsertCandidate = async (testId, candidate) => {
  const student = await Students.getStudentsByEmail(candidate.email);
  return knex.transaction(
    async (trx) =>
      await trx("candidate")
        .insert({
          id: candidate.id,
          test_id: testId,
          student_id: student?.id || null,
          score: candidate.percentage_score,
          data: JSON.stringify(candidate),
        })
        .onConflict("id")
        .merge()
  );
};

const deleteCandidate = (candidateId) =>
  knex("candidate").where("id", candidateId).del();

module.exports = {
  upsertCandidate,
  getAllCandidatesOfTest,
  deleteCandidate,
};
