const Repuesto = require ('../models/repuestos')
const Marcas = require ('../models/marcas')
const Categorias = require ('../models/categorias')

const getRepuestosActivos = async (req, res) => {
    try {
        const repuestosActivos = await Repuesto.find({ estado: "Activo" })
            .populate("idCategoria") // 🔥 Trae el objeto completo de la categoría
            .populate("idMarca"); // 🔥 Trae el objeto completo de la marca

        res.status(200).json({ repuestos: repuestosActivos });
    } catch (error) {
        console.error("Error al obtener repuestos activos:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

const getRepuesto = async (req, res) => {
    try {
        const repuestos = await Repuesto.find()
            .populate("idCategoria") // 🔥 Trae el objeto completo de la categoría
            .populate("idMarca"); // 🔥 Trae el objeto completo de la marca

        res.status(200).json({ repuestos });
    } catch (error) {
        console.error("Error al obtener repuestos:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

const getRepuestosPorCategoria = async (req, res) => {
    try {
        const { categoriaId } = req.params; // 🔥 Obtener el ID de la categoría seleccionada

        const repuestosFiltrados = await Repuesto.find({ idCategoria: categoriaId, estado: "Activo" })
            .populate("idCategoria")
            .populate("idMarca");

        res.status(200).json({ repuestos: repuestosFiltrados });
    } catch (error) {
        console.error("Error al obtener repuestos por categoría:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

const getOneRepuesto = async(req, res) => {
    const {id} = req.params
    const repuesto = await Repuesto.findById(id)
    res.json(repuesto)
}


const putRepuesto = async (req, res) => {
    const { id } = req.params;
    const { idRepuesto, nombre, existencias, precio, precioVenta, idCategoria, idMarca, estado} = req.body;
    let msg = 'Repuesto actualizado';

    try {
        // Validar que la categoria asociada esté activa
        const categoria = await Categorias.findById(idCategoria);
        if (!categoria) {
            return res.status(404).json({ msg: 'Categoria no encontrada' });
        }
        if (categoria.estado !== 'Activo') {
            return res.status(400).json({ msg: 'No se puede utilizar una Categoria inactiva para este repuesto' });
        }

        // Actualizar el repuesto si la marca es válida
        await Repuesto.findByIdAndUpdate(
            id,
            { idRepuesto: idRepuesto, nombre: nombre, existencias: existencias, precio: precio, precioVenta: precioVenta, idCategoria: idCategoria, idMarca: idMarca, estado: estado }
        );
    } catch (error) {
        msg = error.message;
    }

    res.json({ msg: msg });
};

const postRepuesto = async (req, res) => {
    const { existencias, precio, precioVenta, idCategoria, idMarca } = req.body;

    if (existencias < 0 || precio < 0 || precioVenta < 0) {
        return res.status(500).json({ msg: 'El valor de existencias y el precio no puede ser negativo' });
    }

    const marca = await Marcas.findById(idMarca);
    if (!marca) {
        return res.status(404).json({ msg: 'Marca no encontrada' });
    }
    if (marca.estado !== 'Activo') {
        return res.status(400).json({ msg: 'No se puede utilizar una marca inactiva' });
    }

    const categoria = await Categorias.findById(idCategoria);
    if (!categoria) {
        return res.status(404).json({ msg: 'Categoria no encontrada' });
    }
    if (categoria.estado !== 'Activo') {
        return res.status(400).json({ msg: 'No se puede utilizar una categoria inactiva' });
    }

    let msg = 'Repuesto Agregado';
    const body = req.body;

    try {
        const repuesto = new Repuesto(body);
        await repuesto.save();
    } catch (error) {
        msg = error.message; // Capturar el mensaje específico del error
    }

    res.json({ msg });
};

const deleteRepuesto = async (req, res) => {
    let msg = 'Repuesto Eliminado'
    id = req.params.id
    try{
        await Repuesto.findByIdAndDelete({_id: id})
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}

const cambiarEstadoRepuesto = async (req, res) => {
    const { id } = req.params;

    try {
        const repuesto = await Repuesto.findById(id);
        if (!repuesto) {
            return res.status(404).json({ msg: 'Repuesto no encontrado' });
        }

        // Cambiar entre "Activo" e "Inactivo"
        repuesto.estado = repuesto.estado === 'Activo' ? 'Inactivo' : 'Activo';
        await repuesto.save();

        res.json({ 
            msg: `Estado del repuesto cambiado exitosamente a ${repuesto.estado}`, 
            repuesto 
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports = {
    getRepuesto,
    getRepuestosActivos,
    getRepuestosPorCategoria,
    getOneRepuesto,
    putRepuesto,
    postRepuesto,
    deleteRepuesto,
    cambiarEstadoRepuesto
}