const express = require('express');
const { router } = require('./routes')
const path = require('path')
const bodyParser = require("body-parser")

//Helpers con algunas funciones
const helpers = require('./helpers')

// Crear la conexion a la BD
const db = require('./config/db')

// Importar el modelo
require('./models/Proyectos')
require('./models/Tareas')

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error))


//Crear una app d express
const app = express();

//Donde cargar los archivos estaticos
app.use(express.static('public'))

//Habilitar pug
app.set('view engine', 'pug')

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'))

//Pasar var dump a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    next(); // Siguiente middleware
})


//habilitar bodyParser para leer datos del fomrulario
app.use(bodyParser.urlencoded({ extended: true }))


app.use('/', router);


app.listen(3000);