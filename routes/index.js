const express = require('express')
const router = express.Router();

//Importar express validator
const { body } = require('express-validator/check')

//Importar el controlador 
const proyectosController = require('../controllers/proyectosController')

const tareasController = require('../controllers/tareasController')

const usuarioController = require('../controllers/usuariosController')
const authController = require('../controllers/authController')


//Ruta para el home
router.get('/', authController.usuarioAutenticado, proyectosController.proyectosHome)

router.get('/nuevo-proyecto', authController.usuarioAutenticado, proyectosController.formularioProyecto)
router.post('/nuevo-proyecto', authController.usuarioAutenticado, body('nombre').not().isEmpty().trim().escape(), proyectosController.nuevoProyecto)

//Listar Proyecto
router.get('/proyectos/:url', authController.usuarioAutenticado, proyectosController.proyectoPorUrl);

//Actualizar el proyecto
router.get('/proyecto/editar/:id', authController.usuarioAutenticado, proyectosController.formularioEditar);

router.post('/nuevo-proyecto/:id', authController.usuarioAutenticado, body('nombre').not().isEmpty().trim().escape(), proyectosController.actualizarProyecto)

//Eliminar proyecto

router.delete('/proyectos/:url', authController.usuarioAutenticado, proyectosController.eliminarProyecto)

//Tareas

router.post('/proyectos/:url', authController.usuarioAutenticado, tareasController.agregarTarea)

//Actualizar Tarea
router.patch('/tareas/:id', authController.usuarioAutenticado, tareasController.cambiarEstadoTarea)
    //Eliminar Tarea
router.delete('/tareas/:id', authController.usuarioAutenticado, tareasController.eliminarTarea)

// Crear nueva cuenta

router.get('/crear-cuenta', usuarioController.formCrearCuenta)
router.post('/crear-cuenta', usuarioController.crearCuenta)
router.get('/confirmar/:correo', usuarioController.confirmarCuenta)

//Iniciar sesion
router.get('/iniciar-sesion', usuarioController.formIniciarSesion)
router.post('/iniciar-sesion', authController.autenticarUsuario)

//Cerrar sesion
router.get('/cerrar-sesion', authController.cerrarSesion)

//Restablecer contraseña
router.get('/restablecer', usuarioController.fromRestablecerPassword)
router.post('/restablecer', authController.enviarToken)
router.get('/restablecer/:token', authController.validarToken)
router.post('/restablecer/:token', authController.actualizarPassword)


module.exports = {
    router
}