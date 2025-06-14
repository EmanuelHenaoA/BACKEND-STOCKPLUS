const mongoose = require('mongoose')

const clientesSchema = new mongoose.Schema (
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio']
        },
        documento: {
            type: Number,
            required: [true, 'El numero de documento es obligatorio'],
            unique: true,
            trim: true,
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

module.exports = mongoose.model('Clientes', clientesSchema)