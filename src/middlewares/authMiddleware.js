const { check, body } = require('express-validator')

exports.registroValidacion = [
    check('nombre', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('telefono', 'El número teléfono es obligatorio').not().isEmpty().isNumeric(),
    body('direccion').isString().isLength({ min: 1 }).withMessage('La dirección debe ser un texto y tener al menos 1 caracter'),
    check('email', 'Por favor ingresa un email valido').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
]

exports.loginValidacion = [
    check('email', 'Por favor ingresa un email valido').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
]
