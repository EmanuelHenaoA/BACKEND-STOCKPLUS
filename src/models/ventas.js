const mongoose = require('mongoose')

const ventasSchema = new mongoose.Schema (
    {
        fecha: {
            type: Date,
            default: Date.now,
            required: [true, 'La fecha es obligatoria']
        },
        idCliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clientes",
            required: [true, "Se requiere el cliente"]
        },
        repuestos: [{
            idRepuesto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Repuestos",
                required: [true, "Se requiere algun repuesto"]
            },
            cantidad: {
                type: Number,
                min: 1,
                required: [true, "Se requiere la cantidad del producto"]
            },
            valor: {
                type: Number,
                required: true,
                min: 0
            }
        }],
        total: {
            type: Number,
            required: true,
            min: 0
        },
        estado: {
            type: String,
            enum: ['Completada', 'Cancelada'], // Solo permite estos dos valores
            default: 'Completada' // Estado por defecto
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Ventas', ventasSchema)
