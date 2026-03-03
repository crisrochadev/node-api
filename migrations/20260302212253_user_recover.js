/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('user_recover', function (table) {
            table.increments('id');
            table.integer('user_id').unsigned();
            table.foreign('user_id').references('users.id');
            table.string('token', 255).unique().notNullable();
            table.timestamps(true, true)
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('user_recover')
};
