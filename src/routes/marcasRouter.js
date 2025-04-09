const {Router} = require ('express')
const { getMarca, getOneMarca, postMarca, putMarca, deleteMarca, cambiarEstadoMarca } = require ('../controllers/marcasController')

const {marcaPorId, marcasValidacion, actualizarMarcaValidacion} = require('../middlewares/marcasMiddleware')

const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

const manejarErroresValidacion = require('../middlewares/erroresMiddleware');

const marcasRouter = Router()
marcasRouter.get('/', autenticarUsuario, verificarPermiso('verMarca'), getMarca)
marcasRouter.get('/:id', autenticarUsuario, verificarPermiso('verMarca'), marcaPorId, manejarErroresValidacion, getOneMarca)
marcasRouter.post('/', autenticarUsuario, verificarPermiso('crearMarca'), marcasValidacion, manejarErroresValidacion, postMarca)
marcasRouter.put('/:id', autenticarUsuario, verificarPermiso('editarMarca'), actualizarMarcaValidacion, manejarErroresValidacion, putMarca)
marcasRouter.delete('/:id', autenticarUsuario, verificarPermiso('eliminarMarca'), marcaPorId, manejarErroresValidacion, deleteMarca)
marcasRouter.patch('/:id', autenticarUsuario, verificarPermiso('eliminarMarca'),  marcaPorId, manejarErroresValidacion, cambiarEstadoMarca)


module.exports = marcasRouter