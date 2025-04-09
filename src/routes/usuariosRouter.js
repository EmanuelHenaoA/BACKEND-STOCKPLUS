const {Router} = require ('express')
const {getUsuario, getOneUsuario, putUsuario, postUsuario, deleteUsuario} = require ('../controllers/usuariosController')

const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

const {usuarioValidacionId, usuariosValidacion, actualizarUsuarioValidacion } = require('../middlewares/usuariosMiddleware')
const manejarErroresValidacion = require('../middlewares/erroresMiddleware')

const usuariosRouter = Router()
usuariosRouter.get('/',autenticarUsuario, verificarPermiso('verUsuario'), getUsuario)
usuariosRouter.get('/:id',autenticarUsuario, verificarPermiso('verUsuario'), usuarioValidacionId, getOneUsuario)
usuariosRouter.post('/', autenticarUsuario, verificarPermiso('crearUsuario'), usuariosValidacion, manejarErroresValidacion, postUsuario)
usuariosRouter.put('/:id',autenticarUsuario, verificarPermiso('editarUsuario'), actualizarUsuarioValidacion,putUsuario)
usuariosRouter.delete('/:id',autenticarUsuario, verificarPermiso('eliminarUsuario'), usuarioValidacionId, deleteUsuario)

module.exports = usuariosRouter

