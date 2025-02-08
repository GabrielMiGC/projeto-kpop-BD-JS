const {pool} = require('./db');

pool.query('SELECT NOW ()', (err, res) => {
    if (err) {
        console.error("Erro na conexão", err);
    } else {
        console.log("Conexão estabelecida");
    }
    pool.end();
});