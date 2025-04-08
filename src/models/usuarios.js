const mongoose = require('mongoose')

const usuariosSchema = new mongoose.Schema (
    {
        nombre: {
            type: String,
            unique: true,
            required: [true, 'El nombre es obligatorio'],
        },
        telefono: {
            type: Number,
            required: [true, 'El numero de celular es obligatorio'],
            trim: true,
        },
        direccion: {
            type: String,
            required: [true, 'La direccion es obligatoria']
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'El email es obligatorio'],
            trim: true,
        },
        contraseña: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            trim: true,
        },
        rol: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roles",
            required: [true, 'El rol es obligatorio'],
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Usuarios', usuariosSchema)