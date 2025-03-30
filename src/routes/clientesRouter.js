const {Router} = require ('express')

const {getCliente, getOneCliente, putCliente, postCliente, deleteCliente} = require ('../controllers/clientesController')

const {clientesValidacion, clienteValidacionId, actualizarClienteValidacion } = require('../middlewares/clientesMiddleware')

const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

const manejarErroresValidacion = require('../middlewares/erroresMiddleware');

const clientesRouter = Router()
clientesRouter.get('/',autenticarUsuario, verificarPermiso('verCliente'), getCliente)
clientesRouter.get('/:id',autenticarUsuario, verificarPermiso('verCliente'), clienteValidacionId, manejarErroresValidacion, getOneCliente)
clientesRouter.post('/',autenticarUsuario, verificarPermiso('crearCliente'),clientesValidacion, manejarErroresValidacion, postCliente)
clientesRouter.put('/',autenticarUsuario, verificarPermiso('editarCliente'), actualizarClienteValidacion, manejarErroresValidacion, putCliente)
clientesRouter.delete('/:id',autenticarUsuario, verificarPermiso('eliminarCliente'), clienteValidacionId, manejarErroresValidacion, deleteCliente)

module.exports = clientesRouter