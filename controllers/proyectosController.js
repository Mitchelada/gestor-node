const Proyecto = require('../models/Proyectos')
const Tarea = require('../models/Tareas')
const slug = require('slug')


exports.proyectosHome = async(req, res) => {

    // console.log(res.locals.usuario);

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyecto.findAll({ where: { usuarioId } });

    res.render("index", {
        nombrePagina: 'Proyectos',
        proyectos
    })
}

exports.formularioProyecto = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyecto.findAll({ where: { usuarioId } });

    res.render("nuevoProyecto", {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyecto.findAll({ where: { usuarioId } });

    // Enviar a la consola lo que el usuario escriba
    // console.log(req.body);

    // validar que tengamos algo en el input
    const { nombre } = req.body

    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un nombre al proyecto' })
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // No hay errores
        // Insertar en la Bd
        const usuarioId = res.locals.usuario.id;
        await Proyecto.create({ nombre, usuarioId });
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async(req, res, next) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyecto.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyecto.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

    // Consultar tareas del proyecto actual

    const tareas = await Tarea.findAll({
        where: {
            proyectoId: proyecto.id
        },
        // include: [ // -> trae el modelo del que es parte por clave foranea
        //     { model: Proyecto }
        // ]
    })

    console.log(tareas);
    if (!proyecto) return next();

    //render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async(req, res) => {


    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = await Proyecto.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyecto.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])


    //render a la vista 
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyecto.findAll({ where: { usuarioId } });

    // Enviar a la consola lo que el usuario escriba
    // console.log(req.body);

    // validar que tengamos algo en el input
    const { nombre } = req.body

    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un nombre al proyecto' })
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // No hay errores
        // Insertar en la Bd
        await Proyecto.update({ nombre }, { where: { id: req.params.id } });
        res.redirect('/');
    }
}

exports.eliminarProyecto = async(req, res, next) => {
    //req, query o params
    // console.log(req.query);
    const { urlProyecto } = req.query

    const resultado = await Proyecto.destroy({ where: { url: urlProyecto } })


    if (!resultado) {
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente')
}