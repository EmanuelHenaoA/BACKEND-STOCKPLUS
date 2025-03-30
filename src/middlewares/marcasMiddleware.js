const { check } = require('express-validator')

exports.marcasValidacion = [
    check('nombre', 'El nombre de la marca de los repuestos es obligatorio').not().isEmpty().isString(),
]

exports.marcaPorId = [
    check('id').isMongoId().withMessage('El id de la marca no es valido'),
]

exports.actualizarMarcaValidacion = [
    check('id').isMongoId().withMessage('El id de la marca no es valido'),
    check('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('El estado solo puede ser Activo o Inactivo')
]