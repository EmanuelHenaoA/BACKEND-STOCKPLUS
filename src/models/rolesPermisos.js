const mongoose = require('mongoose')

const RolesPermisosSchema = new mongoose.Schema(
    {
        rol: { // Cambiado de idRol
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Roles', 
            required: true 
        },
        permiso: { // Cambiado de idPermiso
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Permisos', 
            required: true 
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('RolesPermisos', RolesPermisosSchema);

  