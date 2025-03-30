const {Router} = require ('express')

const {crearPermiso, obtenerPermisoPorId, obtenerPermisos, eliminarPermiso, actualizarPermiso} = require ('../controllers/permisosController.js')

const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

const permisosRouter = Router()
permisosRouter.get('/', autenticarUsuario, verificarPermiso('verPermiso'), obtenerPermisos )
permisosRouter.get('/:id', autenticarUsuario, verificarPermiso('verPermiso'), obtenerPermisoPorId )
permisosRouter.post('/', autenticarUsuario, verificarPermiso('crearPermiso'), crearPermiso)
permisosRouter.put('/:id', autenticarUsuario, verificarPermiso('editarPermiso'), actualizarPermiso )
permisosRouter.delete('/:id', autenticarUsuario, verificarPermiso('eliminarPermiso'), eliminarPermiso)

module.exports = permisosRouter