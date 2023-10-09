const knex = require("./knex");

const getAllStudents = () =>
  knex("student")
    .select("student.*", "hr_email.email as hrEmail")
    .leftJoin("hr_email", "student.id", "hr_email.student");

const getStudentById = (id) =>
  knex("student")
    .select("student.*", "hr_email.email as hrEmail")
    .leftJoin("hr_email", "student.id", "hr_email.student")
    .where("id", id)
    .first();

const getStudentsByEmail = async (email) => {
  return await knex("student")
    .select("student.*", "hr_email.email as hrEmail")
    .leftJoin("hr_email", "student.id", "hr_email.student")
    .where("student.email", email)
    .orWhere("hrEmail", email)
    .first();
};

const getStudentsByGroupId = async (groupId) => {
  return await knex("student")
    .select("student.*", "hr_email.email as hrEmail")
    .leftJoin("hr_email", "student.id", "hr_email.student")
    .where("student.group_id", groupId);
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
  getStudentById,
  getStudentsByGroupId,
  getStudentsByEmail,
  getAllStudents,
  deleteStudent,
};
