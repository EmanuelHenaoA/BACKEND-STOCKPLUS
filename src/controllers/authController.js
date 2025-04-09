const mongoose = require ('mongoose')
const Usuario = require('../models/usuarios')
const crypto = require("crypto");
const nodemailer = require("nodemailer");


const {validationResult} = require('express-validator')

const bcrypt = require('bcrypt')

const  jwt = require ('jsonwebtoken');
const usuarios = require('../models/usuarios');

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
        console.log("✅ Token generado en el backend:", accessToken);
        console.log("✅ ACCESS_SECRET_TOKEN:", process.env.ACCESS_SECRET_TOKEN);
        console.log("✅ EMAIL_USER:", process.env.EMAIL_USER);
        
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

const enviarTokenRecuperacion = async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(404).json({ success: false, msg: "El usuario no existe" });
        }

        const token = crypto.randomBytes(20).toString("hex");
        const expiracion = Date.now() + 3600000; // 1 hora

        usuario.resetPasswordToken = token;
        usuario.resetPasswordExpires = expiracion;
        await usuario.save();

        // Configura tu transportador de correo
        const transporter = nodemailer.createTransport({
            service: 'gmail', // o el servicio que uses
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: usuario.email,
            from: 'tuapp@example.com',
            subject: 'Recuperación de contraseña',
            html: `<p>Hola ${usuario.nombre},</p>
                   <p>Has solicitado restablecer tu contraseña.</p>
                   <p>Haz clic en el siguiente enlace para establecer una nueva contraseña:</p>
                   <a href="http://localhost:3000/reset-password/${token}">Restablecer Contraseña</a>
                   <p>Este enlace expirará en 1 hora.</p>`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, msg: "Se ha enviado un correo con instrucciones" });

    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

const resetearContraseña = async (req, res) => {
    try {
        const { token } = req.params;
        const { nuevaContraseña } = req.body;

        const usuario = await Usuario.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({ success: false, msg: "El token es inválido o ha expirado" });
        }

        const hashContraseña = await bcrypt.hash(nuevaContraseña, 10);
        usuario.contraseña = hashContraseña;
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpires = undefined;

        await usuario.save();

        res.status(200).json({ success: true, msg: "La contraseña se ha actualizado correctamente" });

    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};



module.exports = {
    registrarUsuario,
    loginUsuario,
    resetearContraseña,
    enviarTokenRecuperacion
}