const authRouter = require('./authRouter');
const rolesRouter = require('./rolesRouter');
const proveedoresRouter = require('./proveedoresRouter');
const usuariosRouter = require('./usuariosRouter');
const repuestosRouter = require('./repuestosRouter');
const categoriasRouter = require('./categoriasRouter');
const marcasRouter = require('./marcasRouter');
const comprasRouter = require('./comprasRouter');
const permisosRouter = require('./permisosRouter');
const rolesPermisosRouter = require('./rolesPermisosRouter');
const clientesRouter = require ('./clientesRouter')
const ventasRouter = require ('./ventasRouter');
const dashboardRouter = require('./dashboardRouter');


const routes = (app) => { 
    app.use('/auth', authRouter); 
    app.use('/dashboard', dashboardRouter)
    app.use('/roles', rolesRouter);
    app.use('/permisos', permisosRouter);
    app.use('/roles-permisos', rolesPermisosRouter);
    app.use('/proveedores', proveedoresRouter);
    app.use('/usuarios', usuariosRouter);
    app.use('/repuestos', repuestosRouter);
    app.use('/categorias', categoriasRouter);
    app.use('/marcas', marcasRouter);
    app.use('/compras', comprasRouter);
    app.use('/ventas', ventasRouter)
    app.use('/clientes', clientesRouter)
};

module.exports = routes;
