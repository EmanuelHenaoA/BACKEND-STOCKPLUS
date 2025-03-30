const express =  require ('express')
const router = express()

const authController = require('../controllers/authController')

const { registroValidacion, loginValidacion } = require ('../middlewares/authMiddleware') 

router.post('/registro', registroValidacion, authController.registrarUsuario )
router.post('/login', loginValidacion, authController.loginUsuario)


module.exports = router