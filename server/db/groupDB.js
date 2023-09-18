const knex = require("./knex");

const getAllGroups = () => knex("group").select("*");

const getGroupsById = (id) => knex("group").select().where("id", id);

const upsertGroup = (group) => {
  return knex.transaction(
    async (trx) =>
      await trx("group")
        .insert({
          group,
        })
        .onConflict("id")
        .merge()
  );
};

const deleteGroup = (groupId) => knex("group").where("id", groupId).del();

module.exports = {
  upsertGroup,
  getGroupsById,
  getAllGroups,
  deleteGroup,
};
