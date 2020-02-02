const passport = require('passport')
const Usuario = require('../models/Usuarios')
const crypto = require('crypto')
const { Op } = require("sequelize");
const bcrypt = require('bcrypt-nodejs')
const enviarEmail = require('../handlers/email')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son obligatorios'
})

// Funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    //si el usuario esta autenticado, adelante
    if (req.isAuthenticated()) {
        return next()
    }

    // sino esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion')
}

//Funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //al cerrar sesion nos lleva al login
    })
}

// Genera un token si el usuario es valido
exports.enviarToken = async(req, res) => {
    // verificar que el usuario existe
    const { email } = req.body
    const usuario = await Usuario.findOne({ where: { email } })

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/restablecer')
    }

    // usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expiracion = Date.now() + 3600000;

    //guardarlos en la base de datos
    await usuario.save();

    //url de rest
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`

    //Envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecer-password'
    })

    // terminar la ejecucion
    req.flash('correcto', 'Se envio un mensaje a tu correo')
    res.redirect('/iniciar-sesion')

}

exports.validarToken = async(req, res) => {

    const usuario = await Usuario.findOne({
        where: {
            token: req.params.token
        }
    })

    // Sino encuentra usuario
    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/restablecer')
    }

    // Formulario para generar el password
    res.render('resetPassword', {
        nombrePagine: 'Restablecer contraseña'
    })
}

//Cambia el password por uno nuevo
exports.actualizarPassword = async(req, res) => {
    //Verifica el token valido pero tambien la fecha de expiracion
    const usuario = await Usuario.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    })

    //verificamos si el usuario existe
    if (!usuario) {
        req.flash('error', 'No Valido')
        res.redirect('/restablecer')
    }

    // hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    usuario.token = null
    usuario.expiracion = null

    //guardamos el nuevo passowrd

    await usuario.save()

    req.flash('correcto', 'Tu password se ha modificado correctamente')
    res.redirect('/iniciar-sesion')


}