const knex = require("./knex");

const getAllGroupTestInfo = async () =>
  await knex("group_test_info").select("*");

const getGroupTestInfo = async (groupId) =>
  await knex("group_test_info").where("group_id", groupId);

const upsertGroupTestInfo = (groupTestInfo) => {
  return knex.transaction(
    async (trx) =>
      await trx("group_test_info")
        .insert(groupTestInfo)
        .onConflict(["group_id", "test_id"])
        .merge()
  );
};

module.exports = {
  getAllGroupTestInfo,
  getGroupTestInfo,
  upsertGroupTestInfo,
};
