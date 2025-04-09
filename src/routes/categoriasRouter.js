const {Router} = require ('express')

const { getCategoria, getOneCategoria, postCategoria, putCategoria, deleteCategoria, cambiarEstadoCategoria } = require ('../controllers/categoriasController')

const {categoriaPorId, categoriasValidacion, actualizarCategoriaValidacion} = require('../middlewares/categoriasMiddleware')

const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

const manejarErroresValidacion = require('../middlewares/erroresMiddleware');

const categoriasRouter = Router()
categoriasRouter.get('/', autenticarUsuario, verificarPermiso('verCategoria'), getCategoria)
categoriasRouter.get('/:id', autenticarUsuario, verificarPermiso('verCategoria'), categoriaPorId, manejarErroresValidacion, getOneCategoria)
categoriasRouter.post('/', autenticarUsuario, verificarPermiso('crearCategoria'), categoriasValidacion, manejarErroresValidacion, postCategoria)
categoriasRouter.put('/:id', autenticarUsuario, verificarPermiso('editarCategoria'), actualizarCategoriaValidacion, manejarErroresValidacion, putCategoria)
categoriasRouter.delete('/:id', autenticarUsuario, verificarPermiso('eliminarCategoria'), categoriaPorId, manejarErroresValidacion, deleteCategoria)
categoriasRouter.patch('/:id', autenticarUsuario, verificarPermiso('eliminarCategoria'), categoriaPorId, cambiarEstadoCategoria)

module.exports = categoriasRouter