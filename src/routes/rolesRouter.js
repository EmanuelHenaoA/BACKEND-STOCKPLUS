const {Router} = require ('express')
const {crearRol, getRol, putRol, deleteRol, getOneRol} = require ('../controllers/rolesController')

const verificarPermiso = require('../middlewares/permisosMiddleware')
const autenticarUsuario = require('../middlewares/jwtMiddleware')
const manejarErroresValidacion = require('../middlewares/erroresMiddleware');
const {validarRol, validarRolId} = require('../middlewares/rolesMiddleware')

const rolesRouter = Router()
rolesRouter.get('/',autenticarUsuario, verificarPermiso('verRol'), getRol)
rolesRouter.get('/:id',autenticarUsuario, verificarPermiso('verRol'), validarRolId, manejarErroresValidacion, getOneRol)
rolesRouter.post('/', autenticarUsuario, verificarPermiso('crearRol'), validarRol, manejarErroresValidacion, crearRol)
rolesRouter.put('/',autenticarUsuario, verificarPermiso('editarRol'),validarRolId, manejarErroresValidacion,  putRol)
rolesRouter.delete('/:id',autenticarUsuario, verificarPermiso('eliminarRol'),validarRolId, manejarErroresValidacion, deleteRol)

module.exports = rolesRouter

