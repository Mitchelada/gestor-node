const Sequelize = require('sequelize')
const db = require('../config/db')
const Proyecto = require('./Proyectos')

const Tarea = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER
})
Tarea.belongsTo(Proyecto); //Clave foranea en tareas


module.exports = Tarea