const { check } = require('express-validator')

exports.proveedoresValidacion = [
    check('nombre', 'El nombre del proveedor es obligatorio').not().isEmpty().isString(),
    check('telefono', 'El número teléfono es obligatorio').not().isEmpty().isNumeric(),
    check('telefono').isLength({ min: 7 }).withMessage('El numero telefonico debe contener minimo 7 caracteres'),
    check('telefono').isLength({ max: 10 }).withMessage('El numero telefonico debe contener maximo 10 caracteres'),
    check('email', 'Por favor ingresa un email valido').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
]

exports.actualizarProveedorValidacion = [
    check('id', 'El id del proveedor es obligatorio').not().isEmpty(),
    check('id').isMongoId().withMessage('El ID del proveedor no es válido'),
    check('nombre', 'El nombre del proveedor es obligatorio').optional().isString(),
    check('telefono', 'El número teléfono es obligatorio').optional().isNumeric(),
    check('email', 'Por favor ingresa un email válido').optional().isEmail().normalizeEmail({
        gmail_remove_dots: true,
    }),
];

exports.proveedorValidacionId = [
    check('id', 'El id del proveedor es obligatorio').not().isEmpty(),
    check('id').isMongoId().withMessage('El ID del proveedor no es válido')
];

