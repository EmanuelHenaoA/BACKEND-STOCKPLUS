const Marcas = require ('../models/marcas')
const Repuestos = require('../models/repuestos');

const getMarca = async (req, res) => {
    const marcas = await Marcas.find()
    res.json({marcas})
}

const getOneMarca = async(req, res) => {
    const {id} = req.params
    const marca = await Marcas.findById(id)
    res.json(marca)
}

const putMarca = async (req, res) => {
    const { nombre, estado} = req.body
    const idMarca = req.params.id; // 🔎 Tomar el ID desde la URL
    
    let msg = 'Marca Actualizada'
    try{
        await Marcas.findByIdAndUpdate(idMarca, {nombre: nombre, estado: estado})
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}

const postMarca = async (req, res) => {
    let msg = 'Marca Creada'
    const body = req.body
    try{
        const marca = new Marcas(body)
        await marca.save()
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}


const deleteMarca = async (req, res) => {
    let msg = 'Marca Eliminada'
    id = req.params.id
    try{
        await Marcas.findByIdAndDelete({_id: id})
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}

const cambiarEstadoMarca = async (req, res) => {
    const { id } = req.params;

    try {
        const marca = await Marcas.findById(id);
        if (!marca) {
            return res.status(404).json({ msg: 'Marca no encontrada' });
        }

        // Verificar si tiene repuestos antes de inactivarla
        if (marca.estado === 'Activo') {
            const repuestosRelacionados = await Repuestos.find({ idMarca: id });
            if (repuestosRelacionados.length > 0) {
                return res.status(400).json({ 
                    msg: 'No se puede marcar como inactiva porque está asociada a repuestos' 
                });
            }
        }

        // Cambiar entre "Activo" e "Inactivo"
        marca.estado = marca.estado === 'Activo' ? 'Inactivo' : 'Activo';
        await marca.save();

        res.json({ 
            msg: `Estado de la Marca cambiado exitosamente a ${marca.estado}`, 
            marca
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


module.exports = {
    getMarca,
    getOneMarca,
    putMarca,
    postMarca,
    deleteMarca,
    cambiarEstadoMarca
}