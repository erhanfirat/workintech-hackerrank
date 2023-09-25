const knex = require("./knex");

const getAllStudents = () => knex("student").select("*");

const getStudentsById = (id) => knex("student").select().where("id", id);

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
};
