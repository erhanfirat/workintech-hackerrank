const axios = require("axios");
const Group = require("../db/GroupModel");
const Student = require("../db/StudentModel");
const { generateReadableTitleByGroupName } = require("../utils/utils");

const JOURNEY = process.env.JOURNEY_ENDPOINT;

// Kullanıcı girişi
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const journeyRes = await axios.post(`${JOURNEY}/login`, {
      Username: email,
      Password: password,
      LanguageCode: "tr",
    });
    res.status(200).json(journeyRes.data);
  } catch (err) {
    next(err);
  }
};

// Kullanıcı doğrulama
exports.verifyMe = async (req, res, next) => {
  try {
    const Authorization = req.headers["authorization"];

    const journeyRes = await axios.get(`${JOURNEY}/user/me`, {
      headers: {
        Authorization,
      },
    });

    res.status(200).json(journeyRes.data);
  } catch (err) {
    next(err);
  }
};

// Grupları ve kullanıcıları getir
exports.fetchGroupsAndUsers = async (req, res, next) => {
  try {
    // Admin olarak giriş yap
    const adminLoginRes = await axios.post(`${JOURNEY}/api/auth/login`, {
      email: "admin@workintech.com.tr",
      password: "GQ1qfFAKpInI6UoOKWB**@",
    });
    const authorization = `Bearer ${adminLoginRes.data.token}`;

    // Grupları getir
    const groupsRes = await axios.get(
      `${JOURNEY}/api/usergroup/datatables?per_page=1000&search=fsweb`,
      { headers: { authorization } }
    );

    const groups = groupsRes.data.data.filter(
      (g) => !g.name.toLowerCase().includes("prework")
    );

    const students = {};

    // Her grup için öğrencileri getir
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      group.name = group.name.trim();
      group.title = generateReadableTitleByGroupName(group.name);
      delete group.for_dropdown;

      // Aktif sprint bilgisi getir
      const activeSprintRes = await axios.get(
        `${JOURNEY}/api/usergroup/journey/${group.id}?per_page=1000`,
        {
          headers: {
            authorization,
          },
        }
      );
      group.active_sprint = activeSprintRes.data.to - 1;

      // Öğrencileri getir
      const studentsRes = await axios.get(
        `${JOURNEY}/api/usergroup/user/datatables/${group.id}?per_page=1000`,
        {
          headers: {
            authorization,
          },
        }
      );
      students[group.id] = studentsRes.data.data;

      // Grubu kaydet
      await Group.upsertGroup(group);

      // Öğrencileri kaydet
      for (let j = 0; j < studentsRes.data.data.length; j++) {
        const student = studentsRes.data.data[j];
        student.group_id = group.id;
        await Student.upsertStudent(student);
      }
    }

    res.status(200).json({ groups, students });
  } catch (err) {
    next(err);
  }
};
