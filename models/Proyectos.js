const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug')
const shortid = require('shortid')


const Proyectos = db.define('proyectos', { // Crea tabla proyectos
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(100), //type va implicito con el valor del atributo
    url: Sequelize.STRING
}, {
    hooks: { // Hook -> sirve para crear acciones antes o despues de cualquier accion CRUD
        beforeCreate(proyecto) {
            // Genera nombre de url con slug "nombre = tienda virtual" 
            // slug => nombre = tienda-virtual
            const url = slug(proyecto.nombre).toLowerCase();


            proyecto.url = `${url}-${shortid.generate()}`
        },
        // beforeUpdate(proyecto){} -> Para actualizar la url pero no es recomendable
    }
})

module.exports = Proyectos