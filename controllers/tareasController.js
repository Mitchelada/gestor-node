const Proyecto = require('../models/Proyectos')
const Tarea = require('../models/Tareas')


exports.agregarTarea = async(req, res, next) => {
    //obtener el proyecto actual
    const proyecto = await Proyecto.findOne({ where: { url: req.params.url } })

    //Leer el valor del input
    const { tarea } = req.body;

    // estado 0 = incompleto y ID de Proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    //Insertar en la base de datos 
    const resultado = await Tarea.create({ tarea, estado, proyectoId });

    if (!resultado) {
        return next()
    }

    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`);

}

exports.cambiarEstadoTarea = async(req, res, next) => {
    const { id } = req.params;
    const tarea = await Tarea.findOne({ where: { id } })

    // cambiar el estado 
    let estado = 0;
    if (tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();

    if (!resultado) return next()

    res.status(200).send('Actualizado')
}

exports.eliminarTarea = async(req, res, next) => {

    // console.log(req.params);
    const { id } = req.params;
    const resultado = await Tarea.destroy({ where: { id } })

    if (!resultado) return next();

    res.status(200).send('Tarea Eliminada Correctamente')


}