const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const repuestosSchema = new mongoose.Schema (
    {
        nombre: {
            type: String,
            unique: true,
            required: [true, 'El nombre es obligatorio'],
        },
        existencias: {
            type: Number,
            required: [true, 'El numero de existencias es obligatorio'],
            min: 0,
            trim: true
        },
        precio: {
            type: Number,
            required: [true, 'El precio es obligatorio'],
            min: 0,
            trim: true
        },
        precioVenta: {
            type: Number,
            required: [true, 'El precio de venta es obligatorio'],
            min: 0,
            trim: true
        },
        estado: {
            type: String,
            enum: ['Activo', 'Inactivo'],
            default: 'Activo',
            required: [true, 'El estado es obligatorio']
        },
        idCategoria: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categorias",
            required: [true, "Se debe categorizar el repuesto"]
        },
        idMarca: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Marcas",
            required: [true, "Se requiere la marca del repuesto"]
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

// Aplicar auto-increment
repuestosSchema.plugin(AutoIncrement, {
    inc_field: 'idRepuesto',
    start_seq: 1
})

module.exports = mongoose.model('Repuestos', repuestosSchema)