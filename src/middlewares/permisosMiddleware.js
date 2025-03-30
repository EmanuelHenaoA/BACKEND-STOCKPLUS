const RolesPermisos = require('../models/rolesPermisos');
const Permisos = require('../models/permisos');

const verificarPermiso = (permisoRequerido) => {
    return async (req, res, next) => {
      try {
        // Verificar el usuario y su rol
        console.log('Usuario en req.user:', req.user);
        const rolUsuario = req.user.rol;

        // Verificar el permiso requerido
        console.log('Permiso requerido:', permisoRequerido);
        const permiso = await Permisos.findOne({ nombre: permisoRequerido });
        if (!permiso) {
          console.log(`El permiso ${permisoRequerido} no existe en la base de datos.`);
          return res.status(403).json({
            success: false,
            msg: `El permiso ${permisoRequerido} no existe`,
          });
        }

        // Verificar si el rol tiene el permiso
        console.log(`Buscando relación entre el rol (${rolUsuario}) y el permiso (${permiso._id})`);
        const tienePermiso = await RolesPermisos.findOne({
          rol: rolUsuario,
          permiso: permiso._id,
        });

        if (!tienePermiso) {
          console.log(`El rol (${rolUsuario}) no tiene el permiso (${permiso._id}).`);
          return res.status(403).json({
            success: false,
            msg: 'No tienes permiso para realizar esta acción',
          });
        }

        // Si pasa todas las verificaciones
        console.log(`El rol (${rolUsuario}) tiene el permiso requerido (${permisoRequerido}).`);
        next();
      } catch (error) {
        console.error('Error en verificarPermiso:', error); // Registrar el error completo
        return res.status(500).json({
          success: false,
          msg: 'Error al verificar los permisos',
          error: error.message, 
        });
      }
    };
};

  
module.exports = verificarPermiso;
