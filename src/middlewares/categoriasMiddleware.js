const { check } = require('express-validator')

exports.categoriasValidacion = [
    check('nombre', 'El nombre de la categoria de repuestos es obligatorio').not().isEmpty().isString(),
    // check('estado').isIn(['Activo', 'Inactivo']).withMessage('El estado solo puede ser Activo o Inactivo')
]

exports.categoriaPorId = [
    check('id').isMongoId().withMessage('El id de la categoria no es valido')
]
exports.actualizarCategoriaValidacion = [
    check('id').isMongoId().withMessage('El id de la categoria no es valido'),
    check('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('El estado solo puede ser Activo o Inactivo')
]