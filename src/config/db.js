const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_NAME,
    password: process.env.PG_PASS,
    port: process.env.PG_PORT,
});

pool.connect()
    .then(() => console.log(" conectado ao PostgreSQL"))
    .catch(err => console.error("Erro ao conectar ao banco:", err.message));


module.exports = pool;