const Roles = require('../models/roles'); // Modelo de Roles
const Permisos = require('../models/permisos'); // Modelo de Permisos
const RolesPermisos = require('../models/rolesPermisos'); // Modelo de la relación Roles-Permisos
const Usuarios = require('../models/usuarios')
const mongoose = require("mongoose");

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

// Obtener todos los roles
const getRol = async (req, res) => {
    try {
        const roles = await Roles.find();
        
        // Para cada rol, obtenemos sus permisos
        const rolesConPermisos = await Promise.all(roles.map(async (rol) => {
            const permisos = await RolesPermisos.find({ rol: rol._id })
                .populate('permiso', 'nombre descripcion'); // Population de la información del permiso
            
            return {
                ...rol.toObject(),
                permisos: permisos.map(p => p.permiso)
            };
        }));
        
        res.status(200).json(rolesConPermisos);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ error: 'Error al obtener los roles.' });
    }
};

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

const getRolesActivos = async (req, res) => {
    try {
        const rolesActivos = await Roles.find({ estado: "Activo" }); // 🔥 Solo roles disponibles
        res.status(200).json({ roles: rolesActivos });
    } catch (error) {
        console.error("Error al obtener roles activos:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

// Actualizar un rol
const putRol = async (req, res) => {
    const { id } = req.params;
    const { nombre, estado, permisos } = req.body;

    try {
        // Actualizamos la información básica del rol
        const rolActualizado = await Roles.findByIdAndUpdate(id, { nombre, estado }, { new: true });
        
        if (!rolActualizado) {
            return res.status(404).json({ error: 'Rol no encontrado.' });
        }

        // Si se proporcionan permisos, actualizamos las relaciones
        if (permisos && Array.isArray(permisos)) {
            // Obtenemos los permisos actuales del rol
            const permisosActuales = await RolesPermisos.find({ rol: id }).select('permiso');
            const idsPermisosActuales = permisosActuales.map(p => p.permiso.toString());
            
            // Identificamos permisos a eliminar (los que están en actuales pero no en nuevos)
            const permisosAEliminar = idsPermisosActuales.filter(p => !permisos.includes(p));
            if (permisosAEliminar.length > 0) {
                await RolesPermisos.deleteMany({ 
                    rol: id, 
                    permiso: { $in: permisosAEliminar } 
                });
            }
            
            // Identificamos permisos a añadir (los que están en nuevos pero no en actuales)
            const permisosAAgregar = permisos.filter(p => !idsPermisosActuales.includes(p));
            if (permisosAAgregar.length > 0) {
                const nuevasRelaciones = permisosAAgregar.map(permisoId => ({
                    rol: id,
                    permiso: permisoId
                }));
                await RolesPermisos.insertMany(nuevasRelaciones);
            }
        }

        // Obtenemos el rol actualizado con sus permisos para la respuesta
        const permisosDelRol = await RolesPermisos.find({ rol: id })
            .populate('permiso', 'nombre descripcion');
        
        const respuesta = {
            ...rolActualizado.toObject(),
            permisos: permisosDelRol.map(p => p.permiso)
        };

        res.status(200).json({ 
            message: 'Rol actualizado correctamente.', 
            rol: respuesta 
        });
    } catch (error) {
        console.error('Error al actualizar el rol:', error);
        res.status(500).json({ error: 'Error al actualizar el rol.' });
    }
};

// Eliminar un rol
// Eliminar un rol
const deleteRol = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si existen usuarios con este rol
        const usuariosRelacionados = await Usuarios.find({ rol: new mongoose.Types.ObjectId(id) });
        if (usuariosRelacionados.length > 0) {
            return res.status(400).json({ 
                error: 'No se puede eliminar el rol porque está asociado a uno o más usuarios.' 
            });
        }

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


const cambiarEstadoRol = async (req, res) => {
    const { id } = req.params;

    try {
        const rol = await Roles.findById(id);
        if (!rol) {
            return res.status(404).json({ msg: 'Rol no encontrado' });
        }

        if (rol.estado === 'Activo') {
            const usuariosRelacionados = await Usuarios.find({ rol: new mongoose.Types.ObjectId(id) });
            console.log("📌 Usuarios con este rol:", usuariosRelacionados);
            if (usuariosRelacionados.length > 0) {
                return res.status(400).json({ 
                    msg: 'No se puede marcar como inactiva porque está asociada a un usuario' 
                });
            }
        }

        // Cambiar entre "Activo" e "Inactivo"
        rol.estado = rol.estado === 'Activo' ? 'Inactivo' : 'Activo';
        await rol.save();

        res.json({ 
            msg: `Estado del rol cambiado exitosamente a ${rol.estado}`, 
            rol
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports = {
    crearRol,
    getRol,
    getOneRol,
    putRol,
    deleteRol,
    cambiarEstadoRol,
    getRolesActivos
};
