const mongoose = require('mongoose')

const comprasSchema = new mongoose.Schema (
    {
        fecha: {
            type: Date,
            default: Date.now,
            required: [true, 'La fecha es obligatoria']
        },
        idProveedor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Proveedores",
            required: [true, "Se requiere el proveedor"]
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
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Compras', comprasSchema)
