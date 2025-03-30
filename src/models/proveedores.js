const mongoose = require('mongoose')

const proveedoresSchema = new mongoose.Schema (
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio']
        },
        telefono: {
            type: Number,
            required: [true, 'El numero de celular es obligatorio'],
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'El email es obligatorio'],
            trim: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Proveedores', proveedoresSchema)