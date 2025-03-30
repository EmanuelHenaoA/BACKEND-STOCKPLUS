const RolesPermisos = require('../models/rolesPermisos'); // Modelo de la relación Roles-Permisos

const getRolesPermisos = async (req, res) => { 
    const rolesPermisos = await RolesPermisos.find()
    res.json({rolesPermisos}) }

module.exports = {
    getRolesPermisos
}