/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("user_recover", function (table) {
    table.index("token", "idx_user_recover_token");
  });
};



/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("user_recover", function (table) {
    table.dropIndex("token", "idx_user_recover_token");
  });
};
