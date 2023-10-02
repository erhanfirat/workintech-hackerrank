const knex = require("./knex");

const getAllHrEmails = () => knex("hr_email").select("*");

const getHrEmailsByStudentId = (studentId) =>
  knex("hr_email").select().where("student", studentId);

const upsertHrEmail = (hrEmail) => {
  return knex.transaction(
    async (trx) =>
      await trx("hr_email").insert(hrEmail).onConflict("student").merge()
  );
};

const deleteHrEmail = (studentId) =>
  knex("hr_email").where("student", studentId).del();

module.exports = {
  upsertHrEmail,
  getHrEmailsByStudentId,
  getAllHrEmails,
  deleteHrEmail,
};
