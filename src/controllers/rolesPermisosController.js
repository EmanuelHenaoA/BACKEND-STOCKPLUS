const RolesPermisos = require('../models/rolesPermisos'); // Modelo de la relación Roles-Permisos
const Permisos = require('../models/permisos');

const getRolesPermisos = async (req, res) => { 
    const rolesPermisos = await RolesPermisos.find()
    res.json({rolesPermisos}) }


const getPermisosPorRol = async (req, res) => {
  const { idRol } = req.params;

  try {
    const permisos = await RolesPermisos.find({ rol: idRol })
      .populate('permiso', 'nombre'); // Solo traemos el nombre del permiso

    const listaPermisos = permisos.map(p => p.permiso.nombre);

    res.json({
      success: true,
      permisos: listaPermisos
    });
  } catch (error) {
    console.error("Error obteniendo permisos del rol:", error);
    res.status(500).json({
      success: false,
      msg: 'Error al obtener los permisos del rol'
    });
  }
};

module.exports = {
    getRolesPermisos,
    getPermisosPorRol
}