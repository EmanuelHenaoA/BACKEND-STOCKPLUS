const {Router} = require ('express')
const { getRepuesto, getOneRepuesto, postRepuesto, putRepuesto, deleteRepuesto, cambiarEstadoRepuesto, getRepuestosActivos, getRepuestosPorCategoria, getRepuestosActivosPorCategoria } = require ('../controllers/repuestosController')

const {validarRepuesto, ObtenerPorIdValidacion} = require('../middlewares/repuestosMiddleware')

const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

const manejarErroresValidacion = require('../middlewares/erroresMiddleware');

const repuestosRouter = Router()
repuestosRouter.get('/', autenticarUsuario, verificarPermiso('verRepuesto'), getRepuesto)
repuestosRouter.get('/activos', autenticarUsuario, verificarPermiso('verRepuesto'), getRepuestosActivos)
repuestosRouter.get('/activos-catalogo', autenticarUsuario, getRepuestosActivos)
repuestosRouter.get('/categoria/:categoriaId', autenticarUsuario, verificarPermiso('verRepuesto'), getRepuestosPorCategoria)
repuestosRouter.get('/activos/:categoriaId', autenticarUsuario, verificarPermiso('verRepuesto'), getRepuestosActivosPorCategoria)
repuestosRouter.get('/:id', autenticarUsuario, verificarPermiso('verRepuesto'), ObtenerPorIdValidacion, manejarErroresValidacion,getOneRepuesto)
repuestosRouter.post('/', autenticarUsuario, verificarPermiso('crearRepuesto'), validarRepuesto, manejarErroresValidacion,postRepuesto)
repuestosRouter.put('/:id', autenticarUsuario, verificarPermiso('editarRepuesto'), ObtenerPorIdValidacion, manejarErroresValidacion,putRepuesto)
repuestosRouter.delete('/:id', autenticarUsuario, verificarPermiso('eliminarRepuesto'), ObtenerPorIdValidacion, deleteRepuesto)
repuestosRouter.patch('/:id', autenticarUsuario, verificarPermiso('eliminarRepuesto'), ObtenerPorIdValidacion, cambiarEstadoRepuesto)


module.exports = repuestosRouter