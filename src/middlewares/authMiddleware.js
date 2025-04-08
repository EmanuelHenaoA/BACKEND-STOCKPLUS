const { check, body } = require('express-validator')

exports.registroValidacion = [
    check('nombre', 'El nombre del usuario es obligatorio').not().isEmpty().isString(),
    check('telefono', 'El número teléfono es obligatorio').not().isEmpty().isNumeric(),
    check('telefono').isLength({ min: 7 }).withMessage('El numero telefonico debe contener minimo 7 caracteres'),
    check('telefono').isLength({ max: 10 }).withMessage('El numero telefonico debe contener maximo 10 caracteres'),
    check('direccion').isString().isLength({ min: 5 }).withMessage('La dirección debe ser un texto y tener al menos 1 caracter'),
    check('email', 'Por favor ingresa un email valido').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
]

exports.loginValidacion = [
    check('email', 'Por favor ingresa un email valido').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
]
