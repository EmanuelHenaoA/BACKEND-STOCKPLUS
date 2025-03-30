const Repuesto = require ('../models/repuestos')
const Marcas = require ('../models/marcas')
const Categorias = require ('../models/categorias')


const getRepuesto = async (req, res) => {
    const repuestos = await Repuesto.find()
    res.json({repuestos})
}

const getOneRepuesto = async(req, res) => {
    const {id} = req.params
    const repuesto = await Repuesto.findById(id)
    res.json(repuesto)
}


const putRepuesto = async (req, res) => {
    const { idRepuesto, nombre, existencias, precio, precioVenta, idCategoria } = req.body;
    let msg = 'Repuesto actualizado';

    try {
        // Validar que la marca asociada esté activa
        const categoria = await Categorias.findById(idCategoria);
        if (!categoria) {
            return res.status(404).json({ msg: 'Categoria no encontrada' });
        }
        if (categoria.estado !== 'Activo') {
            return res.status(400).json({ msg: 'No se puede utilizar una Categoria inactiva para este repuesto' });
        }

        // Actualizar el repuesto si la marca es válida
        await Repuesto.findOneAndUpdate(
            { idRepuesto: idRepuesto },
            { nombre: nombre, existencias: existencias, precio: precio, precioVenta: precioVenta }
        );
    } catch (error) {
        msg = error.message;
    }

    res.json({ msg: msg });
};

const postRepuesto = async (req, res) => {
    const { existencias, precio, precioVenta, idMarca } = req.body;

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

module.exports = {
    getRepuesto,
    getOneRepuesto,
    putRepuesto,
    postRepuesto,
    deleteRepuesto
}