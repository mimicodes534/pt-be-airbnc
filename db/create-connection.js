const { Pool } = require("pg");

const ENV = process.env.NODE_ENV;
require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

const pool = new Pool();

module.exports = pool;
