const mongoose = require ('mongoose')
const Usuario = require('../models/usuarios')

const {validationResult} = require('express-validator')

const bcrypt = require('bcrypt')

const  jwt = require ('jsonwebtoken')

const registrarUsuario = async(req, res) => {
    try{
        const errores = validationResult(req)
        if(!errores.isEmpty()){
            return res.status(200).json({
                success: true,
                errores: errores.array()
            })
        }

        const {nombre, telefono, direccion, email, contraseña, rol } = req.body

        const usuarioExiste = await Usuario.findOne({ email })
        if(usuarioExiste){
            return res.status(400).json({
                success: false,
                msg: 'Este email ya esta en uso'
            })
        }

        const hashContraseña = await bcrypt.hash(contraseña, 10)
        const usuario = new Usuario({
            nombre, 
            telefono,
            direccion, 
            email, 
            contraseña: hashContraseña,
            rol
        })

        const usuarioData = await usuario.save()

        return res.status(200).json({
            success: true,
            msg: 'Registro Exitoso',
            data: usuarioData
        })
    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const generarAccessToken = async (usuario) => {
    const token = jwt.sign(
        { userId: usuario._id, rol: usuario.rol }, // Aseguramos que `userId` y `rol` estén presentes
        process.env.ACCESS_SECRET_TOKEN,
        { expiresIn: "1h" }
    );
    return token;
};

  

const loginUsuario = async (req, res) => {
    try{
        const errores = validationResult(req)
        if(!errores.isEmpty()){
            return res.status(200).json({
                success: true,
                errores: errores.array()
            })
        }
        
        const {email, contraseña} = req.body

        const usuarioData = await Usuario.findOne({email})
        if(!usuarioData){
            return res.status(400).json({
                success: false,
                msg: 'El email o la contraseña son incorrectos'
            })
        }

        const contraseñaIgual = await bcrypt.compare(contraseña, usuarioData.contraseña)

        if(!contraseñaIgual){
            return res.status(400).json({
                success: false,
                msg: 'El email o la contraseña son incorrectos'
            })
        }

        const accessToken = await generarAccessToken({ _id: usuarioData._id, rol: usuarioData.rol });


        return res.status(200).json({
            success: true,
            msg: 'Logueado Exitosamente',
            accessToken: accessToken,
            tokenType: 'Bearer',
            data: usuarioData
        })

    } catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

module.exports = {
    registrarUsuario,
    loginUsuario
}