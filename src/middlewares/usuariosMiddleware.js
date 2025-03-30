const { check } = require('express-validator')

exports.usuariosValidacion = [
    check('nombre', 'El nombre del usuario es obligatorio').not().isEmpty().isString(),
    check('telefono', 'El número teléfono es obligatorio').not().isEmpty().isNumeric(),
    check('telefono').isLength({ min: 7 }).withMessage('El numero telefonico debe contener minimo 7 caracteres'),
    check('telefono').isLength({ max: 10 }).withMessage('El numero telefonico debe contener maximo 10 caracteres'),
    check('direccion').isString().isLength({ min: 1 }).withMessage('La dirección debe ser un texto y tener al menos 1 caracter'),
    check('email', 'Por favor ingresa un email valido').isEmail().normalizeEmail({

        gmail_remove_dots: true
    }),
    check('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('rol').isMongoId().withMessage('El rol no es válido')
]

exports.actualizarUsuarioValidacion = [
    check('id', 'El id del usuario es obligatorio').not().isEmpty(),
    check('id').isMongoId().withMessage('El ID del usuario no es válido'),
    check('nombre', 'El nombre del usuario es obligatorio').optional().isString(),
    check('telefono', 'El número teléfono es obligatorio').optional().isNumeric(),
    check('direccion').optional().isString().isLength({ min: 1 }).withMessage('La dirección debe ser un texto y tener al menos 1 caracter'),
    check('email', 'Por favor ingresa un email válido').optional().isEmail().normalizeEmail({
        gmail_remove_dots: true,
    }),
    check('contraseña').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('rol').isMongoId().withMessage('El rol no es válido')
];

exports.usuarioValidacionId = [
    check('id', 'El id del usuario es obligatorio').not().isEmpty(),
    check('id').isMongoId().withMessage('El ID del proveedor no es válido')
];

