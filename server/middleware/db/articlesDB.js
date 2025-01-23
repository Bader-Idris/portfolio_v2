// const { Pool } = require("pg"); // TODO: Don't use pg, it's too slow, use either bun.sql or postgres.js
// const {
//   POSTGRES_USER,
//   PSQL_HOST,
//   PSQL_PORT,
//   POSTGRES_PASSWORD,
//   POSTGRES_DB,
// } = require("../../config/config");

// const article = new Pool({
//   connectionString: `postgres://${POSTGRES_USER}:${String(POSTGRES_PASSWORD)}@${PSQL_HOST}:${PSQL_PORT}/${POSTGRES_DB}`,
// });
// module.exports = { Pool, article };