const express =  require ('express')
const router = express()

const authController = require('../controllers/authController')

const { registroValidacion, loginValidacion, recuperarContraseñaValidacion } = require ('../middlewares/authMiddleware') 

router.post('/registro', registroValidacion, authController.registrarUsuario )
router.post('/login', loginValidacion, authController.loginUsuario)
router.post('/forgot-password', authController.enviarTokenRecuperacion);
router.post('/reset-password/:token', recuperarContraseñaValidacion, authController.resetearContraseña);

module.exports = router