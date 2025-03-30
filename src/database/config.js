const mongoose = require('mongoose')

const dbConnection = async() => {
    try{
        await mongoose.connect(process.env.MONGO_CNN)
        console.log('Conectado a la base de datos')
    } catch (error){
        console.error("Error al conectar a la base de datos")
    }
}

module.exports = dbConnection