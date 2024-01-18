const { serveHTTP } = require("stremio-addon-sdk");

const addonInterface = require("./addon");
serveHTTP(addonInterface, { port: 8000 });

const express = require('express');
const cors = require('cors');

const app = express();

// Configura CORS
app.use(cors());

// Resto de la configuración del servidor...

// Inicia el servidor
app.listen(7000, () => {
  console.log('El servidor está escuchando en el puerto 8000');
});
