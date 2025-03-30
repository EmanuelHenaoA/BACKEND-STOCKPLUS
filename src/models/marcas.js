const mongoose = require('mongoose')

const marcasSchema = new mongoose.Schema (
    {
        nombre: {
            type: String,
            unique: true,
            required: [true, 'El nombre es obligatorio']
        },
        estado: {
            type: String,
            enum: ['Activo', 'Inactivo'],
            default: 'Activo',
            required: [true, 'El estado es obligatorio']
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Marcas', marcasSchema)