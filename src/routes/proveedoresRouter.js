const {Router} = require ('express')

const {getProveedor, getOneProveedor, putProveedor, postProveedor, deleteProveedor} = require ('../controllers/proveedoresController')


const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

const manejarErroresValidacion = require('../middlewares/erroresMiddleware');

const {proveedoresValidacion, actualizarProveedorValidacion, proveedorValidacionId} = require('../middlewares/proveedoresMiddleware')

const proveedoresRouter = Router()
proveedoresRouter.get('/', autenticarUsuario, verificarPermiso('verProveedor'), getProveedor)
proveedoresRouter.get('/:id',autenticarUsuario, verificarPermiso('verProveedor'),proveedorValidacionId, manejarErroresValidacion, getOneProveedor)
proveedoresRouter.post('/',autenticarUsuario, verificarPermiso('crearProveedor'),proveedoresValidacion, manejarErroresValidacion, postProveedor)
proveedoresRouter.put('/',autenticarUsuario, verificarPermiso('editarProveedor'),actualizarProveedorValidacion,  manejarErroresValidacion, putProveedor)
proveedoresRouter.delete('/:id',autenticarUsuario, verificarPermiso('eliminarProveedor'),proveedorValidacionId, manejarErroresValidacion, deleteProveedor)

module.exports = proveedoresRouter