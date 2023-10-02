const knex = require("./knex");

const getAllStudents = () =>
  knex("student")
    .select("student.*", "hr_email.email as hrEmail")
    .leftJoin("hr_email", "student.id", "hr_email.student");

const getStudentsById = (id) =>
  knex("student")
    .select("student.*", "hr_email.email as hrEmail")
    .leftJoin("hr_email", "student.id", "hr_email.student")
    .where("id", id);

const getStudentsByEmail = async (email) => {
  return await knex("student")
    .select("student.*", "hr_email.email as hrEmail")
    .leftJoin("hr_email", "student.id", "hr_email.student")
    .where("student.email", email)
    .orWhere("hrEmail", email)
    .first();
};

const upsertStudent = (student) => {
  return knex.transaction(
    async (trx) => await trx("student").insert(student).onConflict("id").merge()
  );
};

const deleteStudent = (studentId) =>
  knex("student").where("id", studentId).del();

module.exports = {
  upsertStudent,
  getStudentsById,
  getAllStudents,
  deleteStudent,
  getStudentsByEmail,
};
