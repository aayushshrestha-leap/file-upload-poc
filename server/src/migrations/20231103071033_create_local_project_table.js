exports.up = function (knex) {
  return knex.schema.createTable("local_projects", function (table) {
    table.uuid("id").primary();
    table.string("name", 255);
    table.string("project_id", 255).unique();
    table.string("description", 255);
    table.string("location", 255);
    table.string("distance_to_site", 255);
    table.string("drawing_reference", 255);
    table.string("note", 255);
    table.int("calculated_by").defaultTo(100);
    table.int("reviewed_by").defaultTo(100);
    table.int("created_by").defaultTo(100);
    table.jsonb("global_inputs");
    table.jsonb("spt_analysis");
    table.jsonb("cpt_analysis");
    table.jsonb("liquefaction_analysis");
    table.jsonb("soil_profile");
    table.jsonb("static_analysis");
    table.boolean("is_archived").defaultTo(false);
    table.boolean("is_deleted").defaultTo(false);
    table.string("rev_id", 255);
    table.int("last_modified_by");
    table.string("hbi_project_number", 255);
    table.string("project_status", 255);
    table.boolean("is_locked").defaultTo(false);
    table.string("file_link", 255).defaultTo("");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("local_projects");
};
