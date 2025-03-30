const { check } = require('express-validator');

const validarVenta = [
    check('idCliente').isMongoId().withMessage('El ID del cliente no es válido'),
    check('repuestos').isArray({ min: 1 }).withMessage('Debe haber al menos un repuesto en la venta'),
    check('repuestos.*.idRepuesto').isMongoId().withMessage('Cada ID de repuesto debe ser válido'),
    check('repuestos.*.cantidad').isInt({ min: 1 }).withMessage('La cantidad a vender de cualquier repuesto es minimo de 1'),
];

const validarVentaId = [
    check('id').isMongoId().withMessage('El ID de la venta no es válido')
]
module.exports = {
    validarVenta,
    validarVentaId
}
