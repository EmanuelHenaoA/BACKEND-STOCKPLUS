// routes/dashboardRoutes.js
const {Router} = require ('express')

const dashboardController = require('../controllers/dashboardController');

const verificarPermiso = require('../middlewares/permisosMiddleware')

const autenticarUsuario = require('../middlewares/jwtMiddleware')

// Rutas del dashboard
const dashboardRouter = Router()
dashboardRouter.get('/ventas-semanales',autenticarUsuario, verificarPermiso('verVenta'), dashboardController.getVentasSemanales);
dashboardRouter.get('/top-clientes', autenticarUsuario, verificarPermiso('verCliente'), dashboardController.getTopClientes);
dashboardRouter.get('/repuestos-mas-vendidos', autenticarUsuario, verificarPermiso('verRepuesto'), dashboardController.getRepuestosMasVendidos);
dashboardRouter.get('/repuestos-mayor-ingreso', autenticarUsuario, verificarPermiso('verRepuesto'), dashboardController.getRepuestosMayorIngreso);
dashboardRouter.get('/estadisticas-generales', autenticarUsuario, verificarPermiso('verEstadisticas'), dashboardController.getEstadisticasGenerales);
dashboardRouter.get('/ventas-por-categoria', autenticarUsuario, verificarPermiso('verVenta'), dashboardController.getVentasPorCategoria);
dashboardRouter.get('/ventas-por-mes', autenticarUsuario, verificarPermiso('verVenta'), dashboardController.getVentasPorMes);

module.exports = dashboardRouter;