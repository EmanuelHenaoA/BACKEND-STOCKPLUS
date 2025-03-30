const Permisos = require('../models/permisos');
const RolesPermisos = require('../models/rolesPermisos');

// Crear un permiso
const crearPermiso = async (req, res) => {
    const { nombre } = req.body;

    try {
        const nuevoPermiso = new Permisos({ nombre });
        await nuevoPermiso.save();
        res.status(201).json({ message: 'Permiso creado exitosamente.', permiso: nuevoPermiso });
    } catch (error) {
        console.error('Error al crear permiso:', error);
        res.status(500).json({ error: 'Error al crear permiso.' });
    }
};

// Obtener todos los permisos
const obtenerPermisos = async (req, res) => {
    try {
        const permisos = await Permisos.find();
        res.status(200).json(permisos);
    } catch (error) {
        console.error('Error al obtener permisos:', error);
        res.status(500).json({ error: 'Error al obtener permisos.' });
    }
};

// Obtener un permiso por ID
const obtenerPermisoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const permiso = await Permisos.findById(id);
        if (!permiso) {
            return res.status(404).json({ error: 'Permiso no encontrado.' });
        }

        res.status(200).json(permiso);
    } catch (error) {
        console.error('Error al obtener permiso:', error);
        res.status(500).json({ error: 'Error al obtener permiso.' });
    }
};

// Actualizar un permiso
const actualizarPermiso = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    try {
        const permisoActualizado = await Permisos.findByIdAndUpdate(id, { nombre }, { new: true });
        if (!permisoActualizado) {
            return res.status(404).json({ error: 'Permiso no encontrado.' });
        }

        res.status(200).json({ message: 'Permiso actualizado correctamente.', permiso: permisoActualizado });
    } catch (error) {
        console.error('Error al actualizar permiso:', error);
        res.status(500).json({ error: 'Error al actualizar permiso.' });
    }
};

// Eliminar un permiso
const eliminarPermiso = async (req, res) => {
    const { id } = req.params;

    try {
        const relaciones = await RolesPermisos.find({ permiso: id });
        if (relaciones.length > 0) {
            return res.status(400).json({ error: 'No se puede eliminar el permiso porque está asociado a roles.' });
        }

        const permisoEliminado = await Permisos.findByIdAndDelete(id);
        if (!permisoEliminado) {
            return res.status(404).json({ error: 'Permiso no encontrado.' });
        }

        res.status(200).json({ message: 'Permiso eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar permiso:', error);
        res.status(500).json({ error: 'Error al eliminar permiso.' });
    }
};

module.exports = {
    crearPermiso,
    obtenerPermisos,
    obtenerPermisoPorId,
    actualizarPermiso,
    eliminarPermiso
};
