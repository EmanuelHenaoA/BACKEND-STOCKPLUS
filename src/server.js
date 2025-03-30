const express = require('express');
const cors = require('cors');
const dbConnect = require('./database/config');
const routes= require('./routes/indexRouter'); // Importar el archivo centralizador de rutas

class Server {
    constructor() {
        this.app = express();
        this.listen();
        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        await dbConnect();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(cors());
    }

    routes() {
        routes(this.app); // Usar el archivo centralizador de rutas
    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Servidor corriendo en el puerto http://localhost:${process.env.PORT}`);
        });
    }
}

module.exports = Server;
