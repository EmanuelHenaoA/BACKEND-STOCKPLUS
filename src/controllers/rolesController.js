const Roles = require('../models/roles'); // Modelo de Roles
const Permisos = require('../models/permisos'); // Modelo de Permisos
const RolesPermisos = require('../models/rolesPermisos'); // Modelo de la relación Roles-Permisos

// Crear un nuevo rol con permisos
const crearRol = async (req, res) => {
    const { nombre, permisos } = req.body;

    try {
        // Asegurarse de que permisos sea un array
        const permisosArray = Array.isArray(permisos) ? permisos : [permisos];

        // Validar que los IDs de permisos sean válidos
        const mongoose = require('mongoose');
        const permisosValidosIds = permisosArray.every((id) => mongoose.Types.ObjectId.isValid(id));
        if (!permisosValidosIds) {
            return res.status(400).json({ error: 'Uno o más permisos tienen un formato inválido.' });
        }

        // Validar que los permisos existen
        const permisosValidos = await Permisos.find({ _id: { $in: permisosArray } });
        if (permisosValidos.length !== permisosArray.length) {
            return res.status(400).json({ error: 'Uno o más permisos no son válidos.' });
        }

        // Crear el nuevo rol
        const nuevoRol = new Roles({ nombre });
        await nuevoRol.save();

        // Crear las relaciones en RolesPermisos
        const relaciones = permisosArray.map((permisoId) => ({
            rol: nuevoRol._id,
            permiso: permisoId,
        }));
        await RolesPermisos.insertMany(relaciones);

        res.status(201).json({ message: 'Rol creado exitosamente.', rol: nuevoRol });
    } catch (error) {
        console.error('Error al crear el rol:', error);
        res.status(500).json({ error: 'Error al crear el rol.' });
    }
};

const getRol = async (req, res) => { 
    const roles = await Roles.find()
    res.json({roles}) }

// Obtener un rol por su ID
const getOneRol = async (req, res) => {
    const { id } = req.params;

    try {
        const rol = await Roles.findById(id);
        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado.' });
        }

        res.status(200).json(rol);
    } catch (error) {
        console.error('Error al obtener el rol:', error);
        res.status(500).json({ error: 'Error al obtener el rol.' });
    }
};

// Actualizar un rol
const putRol = async (req, res) => {
    const { id } = req.params;
    const { nombre, estado } = req.body;

    try {
        const rolActualizado = await Roles.findByIdAndUpdate(id, { nombre, estado }, { new: true });
        if (!rolActualizado) {
            return res.status(404).json({ error: 'Rol no encontrado.' });
        }

        res.status(200).json({ message: 'Rol actualizado correctamente.', rol: rolActualizado });
    } catch (error) {
        console.error('Error al actualizar el rol:', error);
        res.status(500).json({ error: 'Error al actualizar el rol.' });
    }
};

// Eliminar un rol
const deleteRol = async (req, res) => {
    const { id } = req.params;

    try {
        // Eliminar el rol
        const rolEliminado = await Roles.findByIdAndDelete(id);
        if (!rolEliminado) {
            return res.status(404).json({ error: 'Rol no encontrado.' });
        }

        // Eliminar relaciones en RolesPermisos
        await RolesPermisos.deleteMany({ rol: id });

        res.status(200).json({ message: 'Rol eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el rol:', error);
        res.status(500).json({ error: 'Error al eliminar el rol.' });
    }
};

module.exports = {
    crearRol,
    getRol,
    getOneRol,
    putRol,
    deleteRol
};
