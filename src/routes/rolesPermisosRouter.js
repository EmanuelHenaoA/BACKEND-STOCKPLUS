const {Router} = require ('express')

const {getRolesPermisos} = require ('../controllers/rolesPermisosController')

const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

const rolesPermisosRouter = Router()

rolesPermisosRouter.get('/', autenticarUsuario, verificarPermiso('verRol'), getRolesPermisos)

module.exports = rolesPermisosRouter