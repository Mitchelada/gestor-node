const Proyecto = require('../models/Proyectos')
const Tarea = require('../models/Tareas')
const slug = require('slug')


exports.proyectosHome = async(req, res) => {
    const proyectos = await Proyecto.findAll();

    res.render("index", {
        nombrePagina: 'Proyectos',
        proyectos
    })
}

exports.formularioProyecto = async(req, res) => {
    const proyectos = await Proyecto.findAll();

    res.render("nuevoProyecto", {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async(req, res) => {

    const proyectos = await Proyecto.findAll();

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
        await Proyecto.create({ nombre });
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async(req, res, next) => {
    const proyectosPromise = Proyecto.findAll();

    const proyectoPromise = Proyecto.findOne({
        where: {
            url: req.params.url
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

    const proyectosPromise = Proyecto.findAll();

    const proyectoPromise = Proyecto.findOne({
        where: {
            id: req.params.id
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

    const proyectos = await Proyecto.findAll();

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