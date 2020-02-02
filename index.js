const express = require('express');
const { router } = require('./routes')
const path = require('path')
const bodyParser = require("body-parser")
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')


//Helpers con algunas funciones
const helpers = require('./helpers')

// Crear la conexion a la BD
const db = require('./config/db')

// Importar el modelo
require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')


db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error))


//Crear una app d express
const app = express();

//Donde cargar los archivos estaticos
app.use(express.static('public'))

//Habilitar pug
app.set('view engine', 'pug')

//habilitar bodyParser para leer datos del fomrulario
app.use(bodyParser.urlencoded({ extended: true }))

// Agregamos express validator a toda la aplicacion
app.use(expressValidator());

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'))

// agregar flash messages
app.use(flash());

app.use(cookieParser())

// sessiones nos permiten navergar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//Pasar var dump a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash()
    res.locals.usuario = {...req.user } || null;
    next(); // Siguiente middleware
})




app.use('/', router);


app.listen(3000);

require('./handlers/email')