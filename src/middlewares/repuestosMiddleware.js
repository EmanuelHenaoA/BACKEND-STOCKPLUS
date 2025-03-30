const {check} = require('express-validator')

const validarRepuesto = [
    check('idRepuesto', 'El id del repuesto es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre del repuesto es obligatorio').not().isEmpty().isString(),
    check('existencias').isInt({ min: 0 }).withMessage('El numero minimo de existencias es 0'),
    check('precio').isFloat({min: 0 }).withMessage('El precio del respuesto es minimo 0'),
    check('precioVenta').isFloat({min: 0 }).withMessage('El precio de venta del respuesto es minimo 0'),
    check('idCategoria').isMongoId().withMessage('El Id de la categoria debe ser válido'),
    check('idMarca').isMongoId().withMessage('El Id de la marca debe ser válido')
]

const ObtenerPorIdValidacion = [
    check('idRepuesto', 'El id del repuesto es obligatorio').not().isEmpty(),

]

module.exports = {
    validarRepuesto,
    ObtenerPorIdValidacion
}