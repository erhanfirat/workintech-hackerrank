const Student = require("../db/StudentModel");

// Tüm öğrencileri getir
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.getAllStudents();
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};
