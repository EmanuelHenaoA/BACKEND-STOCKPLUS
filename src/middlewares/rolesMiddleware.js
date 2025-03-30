const { check } = require('express-validator');

const validarRol = [
    check('nombre', 'El nombre del rol es obligatorio').not().isEmpty().isString(),
    check('permisos').isMongoId().withMessage('El ID de algun permiso no es válido')
];

const validarRolId = [
    check('id').isMongoId().withMessage('El ID del rol no es válido')
]
module.exports = {
    validarRol,
    validarRolId
}