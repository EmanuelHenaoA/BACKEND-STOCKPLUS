const { check } = require('express-validator');

const validarCompra = [
    check('idProveedor').isMongoId().withMessage('El ID del proveedor no es válido'),
    check('repuestos').isArray({ min: 1 }).withMessage('Debe haber al menos un repuesto en la compra'),
    check('repuestos.*.idRepuesto').isMongoId().withMessage('Cada ID de repuesto debe ser válido'),
    check('repuestos.*.cantidad').isInt({ min: 1 }).withMessage('La cantidad a comprar de cualquier repuesto es minimo de 1'),
];

const validarCompraId = [
    check('id').isMongoId().withMessage('El ID de la compra no es válido')
]
module.exports = {
    validarCompra,
    validarCompraId
}
