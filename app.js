const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const bodyParser = require("body-parser");
const verifyToken = require('./middleware/middleware'); 

// Parsear el contenido enviado
app.use(cors());
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

// Importa las rutas
const r_enterprise = require("./routes/enterprise/enterprise");
const l_login = require("./routes/login/login");

// Direccion de Prueba
app.get("/api/test", (req, res) => {
  res.send("El Servidor esta bien prendido");
});

//ruta de Login
app.use("/api/Token", l_login);

// Middleware verifyToken para todas las rutas a partir de aquí
/* app.use(verifyToken); */


app.use("/api/enterprise", r_enterprise);

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error del servidor' });
});

/* const port = process.env.PORT */
const port = 80
http.listen(port, function () {
  console.log('\n');
  console.log(`>> Express listo y escuchando por el puerto ` + port);
});

module.exports = app;