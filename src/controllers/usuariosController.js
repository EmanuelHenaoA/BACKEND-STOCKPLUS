const Usuario = require ('../models/usuarios')
const bcrypt = require ('bcrypt')

const getUsuario = async (req, res) => {
    const usuarios = await Usuario.find()
    res.json({usuarios})
}

const getOneUsuario = async(req, res) => {
    const {id} = req.params
    const usuario = await Usuario.findById(id)
    res.json(usuario)
}

const putUsuario = async (req, res) => {
    const { nombre, telefono, direccion, email, rol, contraseña } = req.body;
    const idUsuario = req.params.id;

    let msg = "Usuario actualizado";

    try {
        let nuevaContraseña = contraseña;

        if (contraseña) { // Solo encripta si el usuario cambió la contraseña
            const salt = await bcrypt.genSalt(10);
            nuevaContraseña = await bcrypt.hash(contraseña, salt);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            idUsuario,
            { nombre, telefono, direccion, email, rol, contraseña: nuevaContraseña },
            { new: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ success: false, msg: "Usuario no encontrado" });
        }

    } catch (error) {
        msg = error;
    }

    res.json({ msg: msg });
};

const postUsuario = async (req, res) => {
    const body = req.body
    try {
        const usuario = new Usuario(body)
        usuario.contraseña = await bcrypt.hash(body.contraseña, 10)
        await usuario.save()
        res.status(200).json({msg: 'Usuario Creado'})
    }catch(error){
        res.status(500).json({msg: 'Ha ocurrido un problema en la creación'})
    }
}

const deleteUsuario = async (req, res) => {
    let msg = 'Usuario Eliminado'
    id = req.params.id
    try{
        await Usuario.findByIdAndDelete({_id: id})
    }catch(error){
        msg = error
    }
    res.json({msg:msg})
}

module.exports = {
    getUsuario,
    getOneUsuario,
    putUsuario,
    postUsuario,
    deleteUsuario
}