const {Router} = require ('express')

const {getRolesPermisos, getPermisosPorRol} = require ('../controllers/rolesPermisosController')

const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

const rolesPermisosRouter = Router()

rolesPermisosRouter.get('/', autenticarUsuario, verificarPermiso('verRol'), getRolesPermisos)
rolesPermisosRouter.get('/por-rol/:idRol', autenticarUsuario, getPermisosPorRol)

module.exports = rolesPermisosRouter