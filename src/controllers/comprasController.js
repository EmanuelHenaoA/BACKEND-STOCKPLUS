const Compras = require('../models/compras');
const Repuestos = require('../models/repuestos');
const Proveedores = require('../models/proveedores');

const getCompra = async (req, res) => {
    try {
        const compras = await Compras.find().populate("idProveedor"); // 🔥 Trae los datos completos del cliente

        res.status(200).json({ compras });
    } catch (error) {
        console.error("Error al obtener compras:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

const getOneCompra = async(req, res) => {
    const {id} = req.params
    const compra = await Compras.findById(id)
    res.json(compra)
}

const putCompra = async (req, res) => {
    const { idCompra, repuestos, fecha, idProveedor } = req.body;
    let msg = 'Compra actualizada';
    let nuevoTotal = 0;

    try {
        // Obtener la compra actual antes de la actualización
        const compraActual = await Compras.findById(idCompra);
        if (!compraActual) {
            return res.status(404).json({ msg: 'Compra no encontrada' });
        }

          // No permitir editar compras canceladas
          if (compraActual.estado === 'Cancelada') {
            return res.status(400).json({ 
                msg: "No se puede editar una Compra cancelada. Cambie el estado a Completada primero." 
            });
        }

        // Revertir los cambios en existencias de los repuestos de la compra actual
        for (const item of compraActual.repuestos) {
            await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                $inc: { existencias: -item.cantidad } // Restar las cantidades actuales
            });
        }

        // Procesar los nuevos repuestos y calcular el nuevo total
        for (const item of repuestos) {
            const repuesto = await Repuestos.findById(item.idRepuesto);
            if (!repuesto) {
                return res.status(404).json({ msg: `Repuesto con id ${repuestos.nombre} no encontrado` });
            }

            // Actualizar existencias con las nuevas cantidades
            await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                $inc: { existencias: item.cantidad }
            });

            // Calcular el valor del repuesto y sumarlo al nuevo total
            item.valor = repuesto.precio * item.cantidad;
            nuevoTotal += item.valor;
        }

        // Actualizar la compra con la nueva información y el nuevo total
        await Compras.findByIdAndUpdate(
            idCompra,
            { repuestos: repuestos, fecha: fecha, total: nuevoTotal, idProveedor: idProveedor }
        );
    } catch (error) {
        msg = error.message;
        return res.status(500).json({ msg });
    }

    res.json({ msg });
};


const postCompra = async (req, res) => {
    const { repuestos, idProveedor, estado = 'Completada' } = req.body;
    let total = 0;
    let msg = 'Compra Agregada';

    try {
        // Verificar que el estado sea válido
        if (estado !== 'Cancelada' && estado !== 'Completada') {
            return res.status(400).json({ msg: "Estado no válido. Debe ser 'Cancelada' o 'Completada'" });
        }

        // Verificar que el proveedor exista (opcional, pero recomendable)
        const proveedor = await Proveedores.findById(idProveedor);
        if (!proveedor) {
            return res.status(404).json({ msg: "Proveedor no encontrado" });
        }

        // Calcular los valores automáticos para cada repuesto
        for (let item of repuestos) {
            const repuesto = await Repuestos.findById(item.idRepuesto);
            if (!repuesto) {
                return res.status(404).json({ msg: `Repuesto con id ${repuestos.nombre} no encontrado` });
            }

            // Establecer el valor del repuesto basado en su precio
            item.valor = repuesto.precio * item.cantidad;

            // Sumar el subtotal al total de la compra
            total += item.valor;
        }

        // Crear la compra con los valores calculados
        const compra = new Compras({
            ...req.body,
            repuestos,
            total, // Añadir el total calculado
            estado
        });

        await compra.save();

            // Actualizar las existencias solo si el estado es "Completada"
            if (estado === 'Completada') {
                for (let item of repuestos) {
                    await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                        $inc: { existencias: item.cantidad } // Sumar repuestos al inventario
                    });
                }
            }
    } catch (error) {
        msg = error.message;
        return res.status(500).json({ msg });
    }

    res.json({ msg });
};


const deleteCompra = async (req, res) => {
    let msg = 'Compra Eliminada';
    const { id } = req.params;

    try {
        // Encontrar la compra antes de eliminarla
        const compra = await Compras.findById(id);
        if (!compra) {
            return res.status(404).json({ msg: 'Compra no encontrada' });
        }

        // Revertir las existencias de los repuestos asociados a la compra
        for (const item of compra.repuestos) {
            await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                $inc: { existencias: -item.cantidad } // Restar las cantidades compradas
            });
        }

        // Eliminar la compra después de ajustar las existencias
        await Compras.findByIdAndDelete(id);

    } catch (error) {
        msg = error.message;
        return res.status(500).json({ msg });
    }

    res.json({ msg });
};

const cambiarEstadoCompra = async (req, res) => {
    const { id } = req.params;
    let msg = "Estado de compra actualizado";

    try {
        // Obtener la compra actual
        const compra = await Compras.findById(id);
        if (!compra) {
            return res.status(404).json({ msg: "Compra no encontrada" });
        }

        // Determinar el nuevo estado (alternar entre Completada y Cancelada)
        const nuevoEstado = compra.estado === 'Completada' ? 'Cancelada' : 'Completada';

        // Si cambiamos de Completada a Cancelada, restamos los repuestos del inventario
        if (nuevoEstado === 'Cancelada') {
            for (const item of compra.repuestos) {
                const repuesto = await Repuestos.findById(item.idRepuesto);
                if (!repuesto) {
                    return res.status(404).json({ msg: `Repuesto con id ${item.idRepuesto} no encontrado` });
                }

                // Verificar que no queden existencias negativas
                if (repuesto.existencias < item.cantidad) {
                    return res.status(400).json({ 
                        msg: `No se puede cancelar la compra porque ya se han vendido algunos repuestos. Repuesto: ${repuesto.nombre}, Disponible: ${repuesto.existencias}, A restar: ${item.cantidad}` 
                    });
                }

                // Restar los repuestos del inventario (cancelar la adición)
                await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                    $inc: { existencias: -item.cantidad }
                });
            }
        } 
        // Si cambiamos de Cancelada a Completada, sumamos los repuestos al inventario
        else {
            for (const item of compra.repuestos) {
                // Sumar los repuestos al inventario
                await Repuestos.findByIdAndUpdate(item.idRepuesto, {
                    $inc: { existencias: item.cantidad }
                });
            }
        }

        // Actualizar el estado de la compra
        compra.estado = nuevoEstado;
        await compra.save();

        res.json({ 
            msg: `Estado de la compra cambiado exitosamente a ${nuevoEstado}`,
            compra 
        });

    } catch (error) {
        console.error("Error al cambiar estado de compra:", error);
        msg = error.message;
        return res.status(500).json({ msg });
    }
};

module.exports = {
    getCompra,
    getOneCompra,
    putCompra,
    postCompra,
    deleteCompra,
    cambiarEstadoCompra
}