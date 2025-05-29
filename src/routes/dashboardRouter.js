// routes/dashboardRoutes.js
const {Router} = require ('express')

const dashboardController = require('../controllers/dashboardController');

const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

// Rutas del dashboard
const dashboardRouter = Router()
dashboardRouter.get('/ventas-semanales',autenticarUsuario, dashboardController.getVentasSemanales);
dashboardRouter.get('/top-clientes', autenticarUsuario, dashboardController.getTopClientes);
dashboardRouter.get('/repuestos-mas-vendidos', autenticarUsuario, dashboardController.getRepuestosMasVendidos);
dashboardRouter.get('/repuestos-mayor-ingreso', autenticarUsuario, dashboardController.getRepuestosMayorIngreso);
dashboardRouter.get('/estadisticas-generales', autenticarUsuario, dashboardController.getEstadisticasGenerales);
dashboardRouter.get('/ventas-por-categoria', autenticarUsuario, dashboardController.getVentasPorCategoria);
dashboardRouter.get('/ventas-por-mes', autenticarUsuario, dashboardController.getVentasPorMes);
dashboardRouter.get('/repuestos-stock-bajo', autenticarUsuario, dashboardController.getRepuestosStockBajo)

module.exports = dashboardRouter;