// routes/dashboardRoutes.js
const {Router} = require ('express')

const dashboardController = require('../controllers/dashboardController');

const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

// Rutas del dashboard
const dashboardRouter = Router()
dashboardRouter.get('/ventas-semanales',autenticarUsuario, verificarPermiso('verEstadisticas'), dashboardController.getVentasSemanales);
dashboardRouter.get('/top-clientes', autenticarUsuario, verificarPermiso('verEstadisticas'), dashboardController.getTopClientes);
dashboardRouter.get('/repuestos-mas-vendidos', autenticarUsuario, verificarPermiso('verEstadisticas'), dashboardController.getRepuestosMasVendidos);
dashboardRouter.get('/repuestos-mayor-ingreso', autenticarUsuario, verificarPermiso('verEstadisticas'), dashboardController.getRepuestosMayorIngreso);
dashboardRouter.get('/estadisticas-generales', autenticarUsuario, verificarPermiso('verEstadisticas'), dashboardController.getEstadisticasGenerales);
dashboardRouter.get('/ventas-por-categoria', autenticarUsuario, verificarPermiso('verEstadisticas'), dashboardController.getVentasPorCategoria);
dashboardRouter.get('/ventas-por-mes', autenticarUsuario, verificarPermiso('verEstadisticas'), dashboardController.getVentasPorMes);

module.exports = dashboardRouter;