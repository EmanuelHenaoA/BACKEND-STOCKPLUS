const Categoria = require ('../models/categorias')

const getCategoria = async (req, res) => {
    const categorias = await Categoria.find()
    res.json({categorias})
}

const getOneCategoria = async(req, res) => {
    const {id} = req.params
    const categoria = await Categoria.findById(id)
    res.json(categoria)
}

const putCategoria = async (req, res) => {
    const {id, nombre, estado} = req.body
    let msg = 'Categoria Actualizada'
    try{
        await Categoria.findByIdAndUpdate(id, {nombre: nombre, estado: estado})
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

        // Verificar si tiene repuestos antes de inactivarla
        if (categoria.estado === 'Activo') {
            const repuestosRelacionados = await Repuestos.find({ idCategoria: id });
            if (repuestosRelacionados.length > 0) {
                return res.status(400).json({ 
                    msg: 'No se puede marcar como inactiva porque está asociada a repuestos' 
                });
            }
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
    putCategoria,
    postCategoria,
    deleteCategoria,
    cambiarEstadoCategoria
}