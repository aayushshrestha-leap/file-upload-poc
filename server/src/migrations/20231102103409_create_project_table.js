exports.up = function (knex) {
  return knex.schema.createTable("projects", (table) => {
    table.uuid("id").primary().notNullable();
    table.string("project_id").unique().notNullable();
    table.string("url").notNullable();
    table.date("created_at").defaultTo(knex.fn.now());
    table.date("updated_at").defaultTo(knex.fn.now());
    table.int("created_by").defaultTo(100);
    table.int("updated_by").defaultTo(100);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("projects");
};
