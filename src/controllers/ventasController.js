const Ventas = require('../models/ventas');
const Repuestos = require('../models/repuestos');
const Clientes = require('../models/clientes');

const obtenerVenta = async (req, res) => {
    const ventas = await Ventas.find()
    res.json({ventas})
}

const obtenerUnaVenta = async(req, res) => {
    const {id} = req.params
    const venta = await Ventas.findById(id)
    res.json(venta)
}

const actualizarVenta = async (req, res) => {
    const { idVenta, repuestos, fecha, idCliente} = req.body;
    let msg = 'Venta actualizada';
    let nuevoTotal = 0;

    try {
        // Obtener la venta actual antes de la actualización
        const ventaActual = await Ventas.findById(idVenta);
        if (!ventaActual) {
            return res.status(404).json({ msg: 'Venta no encontrada' });
        }

        // Revertir los cambios en existencias de los repuestos de la compra actual
        for (const item of ventaActual.repuestos) {
            await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                $inc: { existencias: -item.cantidad } // Restar las cantidades actuales
            });
        }

        // Procesar los nuevos repuestos y calcular el nuevo total
        for (const item of repuestos) {
            const repuesto = await Repuestos.findById(item.idRepuesto);
            if (!repuesto) {
                return res.status(404).json({ msg: `Repuesto con id ${item.idRepuesto} no encontrado` });
            }

            if (repuesto.existencias < item.cantidad) {
                return res.status(400).json({ msg: `No tienes esa cantidad de existencias del repuesto ${repuestos.nombre}` });
            }            

            // Actualizar existencias con las nuevas cantidades
            await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                $inc: { existencias: item.cantidad }
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
    const { repuestos, idCliente } = req.body;
    let total = 0;
    let msg = 'Venta Agregada';

    try {
        // Verificar que el proveedor exista (opcional, pero recomendable)
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

            if (repuesto.existencias < item.cantidad) {
                return res.status(400).json({ msg: `No tienes esa cantidad de existencias del repuesto ${repuestos.nombre}` });
            }            

            // Establecer el valor del repuesto basado en su precio
            item.valor = repuesto.precioVenta * item.cantidad;

            // Sumar el subtotal al total de la compra
            total += item.valor;
        }

        // Crear la compra con los valores calculados
        const venta = new Ventas({
            ...req.body,
            repuestos,
            total // Añadir el total calculado
        });

        await venta.save();

        // Actualizar las existencias de los repuestos en la base de datos
        for (let item of repuestos) {
            await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                $inc: { existencias: -item.cantidad }
            });
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

module.exports = {
    obtenerVenta,
    obtenerUnaVenta,
    crearVenta,
    actualizarVenta,
    eliminarVenta
}