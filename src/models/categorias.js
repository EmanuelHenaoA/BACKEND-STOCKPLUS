const mongoose = require('mongoose')

const categoriasSchema = new mongoose.Schema (
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
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Categorias', categoriasSchema)