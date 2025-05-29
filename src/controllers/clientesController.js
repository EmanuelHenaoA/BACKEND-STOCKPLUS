const Cliente = require ('../models/clientes')

const getCliente = async (req, res) => {
    const clientes = await Cliente.find()
    res.json({clientes})
}

const getOneCliente = async(req, res) => {
    const {id} = req.params
    const cliente = await Cliente.findById(id)
    res.json(cliente)
}

const putCliente = async (req, res) => {
    const {documento, nombre, telefono, email} = req.body
    const idCliente = req.params.id
    let msg = 'Cliente actualizado'
    try{
        await Cliente.findByIdAndUpdate(idCliente, {documento: documento, nombre: nombre, telefono: telefono, email: email})
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}

const postCliente = async (req, res) => {
    let msg = 'Cliente Agregado'
    const body = req.body
    try{
        const cliente = new Cliente (body)
        await cliente.save()
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}

const deleteCliente = async (req, res) => {
    let msg = 'Cliente Eliminado'
    id = req.params.id
    try{
        await Cliente.findByIdAndDelete({_id: id})
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}

module.exports = {
    getCliente,
    getOneCliente,
    postCliente,
    putCliente,
    deleteCliente
}