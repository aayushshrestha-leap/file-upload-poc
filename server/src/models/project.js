const knexfile = require("../knexfile");
const knex = require("knex")(knexfile.development);

const bookshelf = require("bookshelf")(knex);

const Project = bookshelf.Model.extend({
  tableName: "projects"
});

module.exports = {
  Project
};
