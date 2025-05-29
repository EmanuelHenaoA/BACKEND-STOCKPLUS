const Proveedor = require ('../models/proveedores')

const getProveedor = async (req, res) => {
    const proveedores = await Proveedor.find()
    res.json({proveedores})
}

const getOneProveedor = async(req, res) => {
    const {id} = req.params
    const proveedor = await Proveedor.findById(id)
    res.json(proveedor)
}

const getProveedoresActivos = async (req, res) => {
    try {
        const proveedoresActivos = await Proveedor.find({ estado: "Activo" }); // 🔥 Solo categorías disponibles
        res.status(200).json({ proveedores: proveedoresActivos });
    } catch (error) {
        console.error("Error al obtener proveedores activos:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

const putProveedor = async (req, res) => {
    const {nombre, telefono, email, estado} = req.body
    const idProveedor = req.params.id; // 🔎 Tomar el ID desde la URL

    let msg = 'Proveedor actualizado'
    try{
        await Proveedor.findByIdAndUpdate(idProveedor, {nombre: nombre, telefono: telefono, email: email, estado: estado},  { new: true, runValidators: true })
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}

const postProveedor = async (req, res) => {
    let msg = 'Proveedor Agregado'
    const body = req.body
    try{
        const proveedor = new Proveedor (body)
        await proveedor.save()
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}

const deleteProveedor = async (req, res) => {
    let msg = 'Proveedor Eliminado'
    id = req.params.id
    try{
        await Proveedor.findByIdAndDelete({_id: id})
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}

const cambiarEstadoProveedor = async (req, res) => {
    const { id } = req.params;

    try {
        const proveedor = await Proveedor.findById(id);
        if (!proveedor) {
            return res.status(404).json({ msg: 'Proveedor no encontrado' });
        }

        // Cambiar entre "Activo" e "Inactivo"
        proveedor.estado = proveedor.estado === 'Activo' ? 'Inactivo' : 'Activo';
        await proveedor.save();

        res.json({ 
            msg: `Estado del proveedor cambiado exitosamente a ${proveedor.estado}`, 
            proveedor 
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports = {
    getProveedor,
    getOneProveedor,
    getProveedoresActivos,
    putProveedor,
    postProveedor,
    deleteProveedor, 
    cambiarEstadoProveedor
}