const Ventas = require('../models/ventas');
const Repuestos = require('../models/repuestos');
const Clientes = require('../models/clientes');

const obtenerVenta = async (req, res) => {
    try {
        const ventas = await Ventas.find().populate("idCliente"); // 🔥 Trae los datos completos del cliente

        res.status(200).json({ ventas });
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

const obtenerUnaVenta = async(req, res) => {
    const {id} = req.params
    const venta = await Ventas.findById(id)
    res.json(venta)
}

const actualizarVenta = async (req, res) => {
    const { idVenta, repuestos, fecha, idCliente } = req.body;
    let msg = "Venta actualizada";
    let nuevoTotal = 0;

    try {
        // Obtener la venta actual antes de la actualización
        const ventaActual = await Ventas.findById(idVenta);
        if (!ventaActual) {
            return res.status(404).json({ msg: "Venta no encontrada" });
        }

           // No permitir editar compras canceladas
           if (ventaActual.estado === 'Cancelada') {
            return res.status(400).json({ 
                msg: "No se puede editar una venta cancelada. Cambie el estado a Completada primero." 
            });
        }

        // Procesar los nuevos repuestos y calcular el nuevo total
        for (const item of repuestos) {
            const repuesto = await Repuestos.findById(item.idRepuesto);
            if (!repuesto) {
                return res.status(404).json({ msg: `Repuesto con id ${item.idRepuesto} no encontrado` });
            }

            // Obtener la cantidad previa en la venta
            const itemPrevio = ventaActual.repuestos.find(r => r.idRepuesto.toString() === item.idRepuesto);
            const cantidadAnterior = itemPrevio ? itemPrevio.cantidad : 0;

            // Calcular la diferencia entre la cantidad nueva y la anterior
            const diferenciaCantidad = item.cantidad - cantidadAnterior;

            // Verificar si el ajuste de existencias es posible
            if (repuesto.existencias - diferenciaCantidad < 0) {
                return res.status(400).json({ msg: `No puedes reducir más existencias de las disponibles para el repuesto ${repuesto.nombre}` });
            }

            // Actualizar existencias correctamente con la diferencia
            await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                $inc: { existencias: -diferenciaCantidad } // 🔥 Solo ajusta la cantidad nueva en relación con la anterior
            });

            // Calcular el valor del repuesto y sumarlo al nuevo total
            item.valor = repuesto.precioVenta * item.cantidad;
            nuevoTotal += item.valor;
        }

        // Actualizar la compra con la nueva información y el nuevo total
        await Ventas.findByIdAndUpdate(
            idVenta,
            { idCliente: idCliente, repuestos: repuestos, fecha: fecha, total: nuevoTotal }
        );

    } catch (error) {
        msg = error.message;
        return res.status(500).json({ msg });
    }

    res.json({ msg });
};

const crearVenta = async (req, res) => {
    const { repuestos, idCliente, estado = 'Completada' } = req.body; // Establecer estado por defecto como "Completada"
    let total = 0;
    let msg = 'Venta Agregada';

    try {
        // Verificar que el estado sea válido
        if (estado !== 'Cancelada' && estado !== 'Completada') {
            return res.status(400).json({ msg: "Estado no válido. Debe ser 'Cancelada' o 'Completada'" });
        }

        // Verificar que el cliente exista
        const cliente = await Clientes.findById(idCliente);
        if (!cliente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }

        // Calcular los valores automáticos para cada repuesto
        for (let item of repuestos) {
            const repuesto = await Repuestos.findById(item.idRepuesto);
            if (!repuesto) {
                return res.status(404).json({ msg: `Repuesto no encontrado` });
            }

            if (estado === 'Completada' && repuesto.existencias < item.cantidad) {
                return res.status(400).json({ msg: `No tienes esa cantidad de existencias del repuesto ${repuesto.nombre}` });
            }            

            // Establecer el valor del repuesto basado en su precio
            item.valor = repuesto.precioVenta * item.cantidad;

            // Sumar el subtotal al total de la compra
            total += item.valor;
        }

        // Crear la venta con los valores calculados
        const venta = new Ventas({
            ...req.body,
            repuestos,
            total,
            estado // Incluir el estado en la creación
        });

        await venta.save();

        // Actualizar las existencias solo si el estado es "Completada"
        if (estado === 'Completada') {
            for (let item of repuestos) {
                await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                    $inc: { existencias: -item.cantidad }
                });
            }
        }
    } catch (error) {
        msg = error.message;
        return res.status(500).json({ msg });
    }

    res.json({ msg });
};


const eliminarVenta = async (req, res) => {
    let msg = 'Venta Eliminada';
    const { id } = req.params;

    try {
        // Encontrar la compra antes de eliminarla
        const venta = await Ventas.findById(id);
        if (!venta) {
            return res.status(404).json({ msg: 'Venta no encontrada' });
        }

        // Revertir las existencias de los repuestos asociados a la compra
        for (const item of venta.repuestos) {
            await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                $inc: { existencias: item.cantidad } // revertir las cantidades vendidas
            });
        }

        // Eliminar la compra después de ajustar las existencias
        await Ventas.findByIdAndDelete(id);

    } catch (error) {
        msg = error.message;
        return res.status(500).json({ msg });
    }

    res.json({ msg });
};

const cambiarEstadoVenta = async (req, res) => {
    const { id } = req.params;
    let msg = "Estado de venta actualizado";

    try {
        // Obtener la venta actual
        const venta = await Ventas.findById(id);
        if (!venta) {
            return res.status(404).json({ msg: "Venta no encontrada" });
        }

        // Determinar el nuevo estado (alternar entre Completada y Cancelada)
        const nuevoEstado = venta.estado === 'Completada' ? 'Cancelada' : 'Completada';

        // Si cambiamos de Completada a Cancelada, devolvemos los repuestos al inventario
        if (nuevoEstado === 'Cancelada') {
            for (const item of venta.repuestos) {
                await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                    $inc: { existencias: item.cantidad } // Devolver los repuestos al inventario
                });
            }
        } 
        // Si cambiamos de Cancelada a Completada, restamos los repuestos del inventario
        else {
            for (const item of venta.repuestos) {
                const repuesto = await Repuestos.findById(item.idRepuesto);
                if (!repuesto) {
                    return res.status(404).json({ msg: `Repuesto con id ${item.idRepuesto} no encontrado` });
                }

                // Verificar si hay suficientes existencias
                if (repuesto.existencias < item.cantidad) {
                    return res.status(400).json({ 
                        msg: `No hay suficientes existencias del repuesto ${repuesto.nombre}. Disponible: ${repuesto.existencias}, Requerido: ${item.cantidad}` 
                    });
                }

                // Actualizar existencias
                await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                    $inc: { existencias: -item.cantidad } // Restar repuestos del inventario
                });
            }
        }

        // Actualizar el estado de la venta
        venta.estado = nuevoEstado;
        await venta.save();

        res.json({ 
            msg: `Estado de la venta cambiado exitosamente a ${nuevoEstado}`,
            venta 
        });

    } catch (error) {
        console.error("Error al cambiar estado de venta:", error);
        msg = error.message;
        return res.status(500).json({ msg });
    }
};

module.exports = {
    obtenerVenta,
    obtenerUnaVenta,
    crearVenta,
    actualizarVenta,
    eliminarVenta,
    cambiarEstadoVenta
}