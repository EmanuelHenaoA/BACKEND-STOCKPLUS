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

const putProveedor = async (req, res) => {
    const {nombre, telefono, email} = req.body
    const idProveedor = req.params.id; // 🔎 Tomar el ID desde la URL

    let msg = 'Proveedor actualizado'
    try{
        await Proveedor.findByIdAndUpdate(idProveedor, {nombre: nombre, telefono: telefono, email: email},  { new: true, runValidators: true })
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

module.exports = {
    getProveedor,
    getOneProveedor,
    putProveedor,
    postProveedor,
    deleteProveedor
}