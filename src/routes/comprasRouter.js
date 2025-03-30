const {Router} = require ('express')
const { getCompra, getOneCompra, postCompra, putCompra, deleteCompra } = require ('../controllers/comprasController')

const {validarCompra, validarCompraId} = require('../middlewares/comprasMiddleware')


const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

const manejarErroresValidacion = require('../middlewares/erroresMiddleware');

const comprasRouter = Router()
comprasRouter.get('/', autenticarUsuario, verificarPermiso('verCompra'), getCompra)
comprasRouter.get('/:id', autenticarUsuario, verificarPermiso('verCompra'), validarCompraId, manejarErroresValidacion, getOneCompra)
comprasRouter.post('/', autenticarUsuario, verificarPermiso('crearCompra'), validarCompra, manejarErroresValidacion, postCompra)
comprasRouter.put('/', autenticarUsuario, verificarPermiso('editarCompra'),  validarCompra, manejarErroresValidacion, putCompra)
comprasRouter.delete('/:id', autenticarUsuario, verificarPermiso('eliminarCompra'), validarCompraId, manejarErroresValidacion, deleteCompra)

module.exports = comprasRouter