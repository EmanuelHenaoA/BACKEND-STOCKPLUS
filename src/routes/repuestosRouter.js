const {Router} = require ('express')
const { getRepuesto, getOneRepuesto, postRepuesto, putRepuesto, deleteRepuesto, cambiarEstadoRepuesto } = require ('../controllers/repuestosController')

const {validarRepuesto, ObtenerPorIdValidacion} = require('../middlewares/repuestosMiddleware')

const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

const manejarErroresValidacion = require('../middlewares/erroresMiddleware');

const repuestosRouter = Router()
repuestosRouter.get('/', autenticarUsuario, verificarPermiso('verRepuesto'), getRepuesto)
repuestosRouter.get('/:id', autenticarUsuario, verificarPermiso('verRepuesto'), ObtenerPorIdValidacion, manejarErroresValidacion,getOneRepuesto)
repuestosRouter.post('/', autenticarUsuario, verificarPermiso('crearRepuesto'), validarRepuesto, manejarErroresValidacion,postRepuesto)
repuestosRouter.put('/:id', autenticarUsuario, verificarPermiso('editarRepuesto'), ObtenerPorIdValidacion, manejarErroresValidacion,putRepuesto)
repuestosRouter.delete('/:id', autenticarUsuario, verificarPermiso('eliminarRepuesto'), ObtenerPorIdValidacion, deleteRepuesto)
repuestosRouter.patch('/:id', autenticarUsuario, verificarPermiso('eliminarRepuesto'), ObtenerPorIdValidacion, cambiarEstadoRepuesto)


module.exports = repuestosRouter