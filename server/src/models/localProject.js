const knexfile = require("../knexfile");
const knex = require("knex")(knexfile.development);

const bookshelf = require("bookshelf")(knex);

const LocalProject = bookshelf.Model.extend({
  tableName: "local_projects"
});

module.exports = {
  LocalProject
};
