const {Router} = require ('express')

const {obtenerVenta, obtenerUnaVenta, crearVenta, actualizarVenta, eliminarVenta, cambiarEstadoVenta} = require ('../controllers/ventasController')

const {validarVenta, validarVentaId, validarPutVenta} = require('../middlewares/ventasMiddleware')

const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

const manejarErroresValidacion = require('../middlewares/erroresMiddleware');

const ventasRouter = Router()
ventasRouter.get('/', autenticarUsuario, verificarPermiso('verVenta'), obtenerVenta)
ventasRouter.get('/:id', autenticarUsuario, verificarPermiso('verVenta'), validarVentaId, manejarErroresValidacion, obtenerUnaVenta)
ventasRouter.post('/', autenticarUsuario, verificarPermiso('crearVenta'), validarVenta, manejarErroresValidacion, crearVenta)
ventasRouter.put('/', autenticarUsuario, verificarPermiso('editarVenta'), validarPutVenta, manejarErroresValidacion, actualizarVenta)
ventasRouter.delete('/:id', autenticarUsuario, verificarPermiso('eliminarVenta'), validarVentaId, manejarErroresValidacion, eliminarVenta)
ventasRouter.patch('/:id', autenticarUsuario, verificarPermiso('estadoVenta'), validarVentaId, manejarErroresValidacion, cambiarEstadoVenta)


module.exports = ventasRouter