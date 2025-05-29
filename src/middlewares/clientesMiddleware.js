const { check } = require('express-validator')

exports.clientesValidacion = [
    check('nombre', 'El nombre del cliente es obligatorio').not().isEmpty().isString(),
    check('documento', 'El número de documento es obligatorio').not().isEmpty().isNumeric(),
    check('documento').isLength({ min: 8 }).withMessage('El numero de documento debe contener minimo 8 caracteres'),
    check('documento').isLength({ max: 10 }).withMessage('El numero de documento debe contener maximo 10 caracteres'),
    check('telefono', 'El número teléfono es obligatorio').not().isEmpty().isNumeric(),
    check('telefono').isLength({ min: 7 }).withMessage('El numero telefonico debe contener minimo 7 caracteres'),
    check('telefono').isLength({ max: 10 }).withMessage('El numero telefonico debe contener maximo 10 caracteres'),
    check('email', 'Por favor ingresa un email valido').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
]

exports.actualizarClienteValidacion = [
    check('id', 'El id del cliente es obligatorio').not().isEmpty(),
    check('id').isMongoId().withMessage('El ID del cliente no es válido'),
    check('nombre', 'El nombre del cliente debe ser un texto válido').optional().isString(),
    check('telefono', 'El número de teléfono debe ser numérico').optional().isNumeric(),
    check('email', 'Por favor ingresa un email válido').optional().isEmail().normalizeEmail({
        gmail_remove_dots: true,
    }),
];

exports.clienteValidacionId = [
    check('id', 'El id del cliente es obligatorio').not().isEmpty(),
    check('id').isMongoId().withMessage('El ID del cliente no es válido')
];

