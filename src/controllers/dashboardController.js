// controllers/dashboardController.js
const Venta = require('../models/ventas');
const Repuesto = require('../models/repuestos');
const Cliente = require('../models/clientes');
const clientes = require('../models/clientes');

// Obtener ventas semanales
exports.getVentasSemanales = async (req, res) => {
  try {
    const ventasSemanales = await Venta.aggregate([
      {
        $match: {
          estado: "Completada" // Solo ventas completadas 
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$fecha" },
            week: { $week: "$fecha" }
          },
          total: { $sum: "$total" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.week": -1
        }
      },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          periodo: { 
            $concat: [
              { $toString: "$_id.year" }, 
              "-S", 
              { $toString: "$_id.week" }
            ]
          },
          total: 1,
          count: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: ventasSemanales
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Obtener top clientes
exports.getTopClientes = async (req, res) => {
  try {
    const topClientes = await Venta.aggregate([
      {
        $match: {
          estado: "Completada" // Solo ventas completadas
        }
      },
      {
        $group: {
          _id: "$idCliente",
          totalCompras: { $sum: 1 },
          montoTotal: { $sum: "$total" }
        }
      },
      {
        $lookup: {
          from: "clientes",
          localField: "_id",
          foreignField: "_id",
          as: "clienteInfo"
        }
      },
      { $unwind: "$clienteInfo" },
      { $sort: { montoTotal: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          id: "$_id",
          nombre: "$clienteInfo.nombre",
          totalCompras: 1,
          montoTotal: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: topClientes
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Obtener repuestos más vendidos (por cantidad)
exports.getRepuestosMasVendidos = async (req, res) => {
  try {
    const repuestosMasVendidos = await Venta.aggregate([
      {
        $match: {
          estado: "Completada" // Solo ventas completadas
        }
      },
      { $unwind: "$repuestos" },
      {
        $group: {
          _id: "$repuestos.idRepuesto",
          totalVendido: { $sum: "$repuestos.cantidad" }
        }
      },
      {
        $lookup: {
          from: "repuestos",
          localField: "_id",
          foreignField: "_id",
          as: "repuestoInfo"
        }
      },
      { $unwind: "$repuestoInfo" },
      { $sort: { totalVendido: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "categorias",
          localField: "repuestoInfo.idCategoria",
          foreignField: "_id",
          as: "categoriaInfo"
        }
      },
      { $unwind: "$categoriaInfo" },
      {
        $lookup: {
          from: "marcas",
          localField: "repuestoInfo.idMarca",
          foreignField: "_id",
          as: "marcaInfo"
        }
      },
      { $unwind: "$marcaInfo" },
      {
        $project: {
          _id: 0,
          id: "$_id",
          nombre: "$repuestoInfo.nombre",
          totalVendido: 1,
          categoria: "$categoriaInfo.nombre",
          marca: "$marcaInfo.nombre"
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: repuestosMasVendidos
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Obtener repuestos con mayor ingreso
exports.getRepuestosMayorIngreso = async (req, res) => {
  try {
    const repuestosMayorIngreso = await Venta.aggregate([
      {
        $match: {
          estado: "Completada" // Solo ventas completadas
        }
      },
      { $unwind: "$repuestos" },
      {
        $group: {
          _id: "$repuestos.idRepuesto",
          totalIngreso: { $sum: { $multiply: ["$repuestos.cantidad", "$repuestos.valor"] } }
        }
      },
      {
        $lookup: {
          from: "repuestos",
          localField: "_id",
          foreignField: "_id",
          as: "repuestoInfo"
        }
      },
      { $unwind: "$repuestoInfo" },
      { $sort: { totalIngreso: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "categorias",
          localField: "repuestoInfo.idCategoria",
          foreignField: "_id",
          as: "categoriaInfo"
        }
      },
      { $unwind: "$categoriaInfo" },
      {
        $lookup: {
          from: "marcas",
          localField: "repuestoInfo.idMarca",
          foreignField: "_id",
          as: "marcaInfo"
        }
      },
      { $unwind: "$marcaInfo" },
      {
        $project: {
          _id: 0,
          id: "$_id",
          nombre: "$repuestoInfo.nombre",
          totalIngreso: 1,
          categoria: "$categoriaInfo.nombre",
          marca: "$marcaInfo.nombre",
          precioVenta: "$repuestoInfo.precioVenta"
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: repuestosMayorIngreso
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Estadísticas generales del dashboard
exports.getEstadisticasGenerales = async (req, res) => {
  try {
    // Total de ventas del mes actual
    const fechaInicio = new Date();
    fechaInicio.setDate(1); // Primer día del mes actual
    fechaInicio.setHours(0, 0, 0, 0);
    
    const fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);
    
    const ventasMes = await Venta.aggregate([
      {
        $match: {
          fecha: { $gte: fechaInicio, $lte: fechaFin },
          estado: "Completada"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          cantidad: { $sum: 1 }
        }
      }
    ]);
    
    // Total de repuestos
    const totalRepuestos = await Repuesto.countDocuments({ estado: "Activo" });
    
    // Total de clientes
    const totalClientes = await Cliente.countDocuments(clientes.nombre);
    
    // Repuestos con stock bajo
    const repuestosStockBajo = await Repuesto.countDocuments({
      estado: "Activo",
      existencias: { $lt: 8 } // Definir umbral según necesidades
    });
    
    res.status(200).json({
      success: true,
      data: {
        ventasMes: ventasMes.length > 0 ? ventasMes[0] : { total: 0, cantidad: 0 },
        totalRepuestos,
        totalClientes,
        repuestosStockBajo
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Ventas por categoría de repuesto
exports.getVentasPorCategoria = async (req, res) => {
  try {
    const ventasPorCategoria = await Venta.aggregate([
      {
        $match: {
          estado: "Completada"
        }
      },
      { $unwind: "$repuestos" },
      {
        $lookup: {
          from: "repuestos",
          localField: "repuestos.idRepuesto",
          foreignField: "_id",
          as: "repuestoInfo"
        }
      },
      { $unwind: "$repuestoInfo" },
      {
        $group: {
          _id: "$repuestoInfo.idCategoria",
          totalVentas: { $sum: { $multiply: ["$repuestos.cantidad", "$repuestos.valor"] } }
        }
      },
      {
        $lookup: {
          from: "categorias",
          localField: "_id",
          foreignField: "_id",
          as: "categoriaInfo"
        }
      },
      { $unwind: "$categoriaInfo" },
      { $sort: { totalVentas: -1 } },
      {
        $project: {
          _id: 0,
          categoria: "$categoriaInfo.nombre",
          totalVentas: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: ventasPorCategoria
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Ventas por mes (últimos 12 meses)
exports.getVentasPorMes = async (req, res) => {
  try {
    // Fecha hace 12 meses
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 11);
    fechaInicio.setDate(1);
    fechaInicio.setHours(0, 0, 0, 0);
    
    const ventasPorMes = await Venta.aggregate([
      {
        $match: {
          fecha: { $gte: fechaInicio },
          estado: "Completada"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$fecha" },
            month: { $month: "$fecha" }
          },
          totalVentas: { $sum: "$total" },
          cantidad: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          periodo: { 
            $concat: [
              { $toString: "$_id.year" }, 
              "-", 
              { $toString: "$_id.month" }
            ]
          },
          totalVentas: 1,
          cantidad: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: ventasPorMes
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};