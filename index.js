const express = require('express');
const app = express();
const path = require("path");
const cors = require('cors');

require('dotenv').config();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); // 🔹 Para suportar form-data
app.use(express.static(path.join(__dirname, "public"))); //

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const artistasRoutes = require('./src/routes/artistas');
const conglomeradosRoutes = require('./src/routes/conglomerados');
const empresasRoutes = require('./src/routes/empresas');
const gruposRoutes = require('./src/routes/grupos');
const discografiaRoutes = require('./src/routes/discografia');

app.use('/api/artistas', artistasRoutes);
app.use('/api/conglomerados', conglomeradosRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/grupos', gruposRoutes);
app.use('/api/discografia', discografiaRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
