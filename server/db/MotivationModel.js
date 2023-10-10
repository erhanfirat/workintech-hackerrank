const knex = require("./knex");

const getMotivation = () =>
  knex("motivation").select("*").orderByRaw("RANDOM()").first();

module.exports = {
  getMotivation,
};
