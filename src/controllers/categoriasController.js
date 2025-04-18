const Categoria = require ('../models/categorias')
const Repuestos = require('../models/repuestos')

const getCategoria = async (req, res) => {
    const categorias = await Categoria.find()
    res.json({categorias})
}

const getCategoriasActivas = async (req, res) => {
    try {
        const categoriasActivas = await Categoria.find({ estado: "Activo" }); // 🔥 Solo categorías disponibles
        res.status(200).json({ categorias: categoriasActivas });
    } catch (error) {
        console.error("Error al obtener categorías activas:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

const getOneCategoria = async(req, res) => {
    const {id} = req.params
    const categoria = await Categoria.findById(id)
    res.json(categoria)
}

const putCategoria = async (req, res) => {
    const {nombre, estado} = req.body
    const idCategoria = req.params.id; // 🔎 Tomar el ID desde la URL

    let msg = 'Categoria Actualizada'
    try{
        await Categoria.findByIdAndUpdate(idCategoria, {nombre: nombre, estado: estado})
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}

const postCategoria = async (req, res) => {
    let msg = 'Categoria Creada'
    const body = req.body
    try{
        const categoria = new Categoria(body)
        await categoria.save()
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}

const deleteCategoria = async (req, res) => {
    let msg = 'Categoria Eliminada'
    id = req.params.id
    try{
        await Categoria.findByIdAndDelete({_id: id})
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}


const cambiarEstadoCategoria = async (req, res) => {
    const { id } = req.params;

    try {
        const categoria = await Categoria.findById(id);
        if (!categoria) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        // Cambiar entre "Activo" e "Inactivo"
        categoria.estado = categoria.estado === 'Activo' ? 'Inactivo' : 'Activo';
        await categoria.save();

        res.json({ 
            msg: `Estado de la categoría cambiado exitosamente a ${categoria.estado}`, 
            categoria 
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


module.exports = {
    getCategoria,
    getOneCategoria,
    getCategoriasActivas,
    putCategoria,
    postCategoria,
    deleteCategoria,
    cambiarEstadoCategoria
}