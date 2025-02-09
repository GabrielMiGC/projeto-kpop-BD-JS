const express = require('express');
const app = express();
const path = require("path");
const cors = require('cors');

require('dotenv').config();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); 

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const artistasRoutes = require('./src/routes/artistas');
const conglomeradosRoutes = require('./src/routes/conglomerados');
const empresasRoutes = require('./src/routes/empresas');
const gruposRoutes = require('./src/routes/grupos');
const discografiaRoutes = require('./src/routes/discografia');
const papeisRouter = require('./src/routes/papeis');
const premiosRouter = require('./src/routes/premios');

app.use('/api/artistas', artistasRoutes);
app.use('/api/conglomerados', conglomeradosRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/grupos', gruposRoutes);
app.use('/api/discografia', discografiaRoutes);
app.use('/papeis', papeisRouter);
app.use('/premios', premiosRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
