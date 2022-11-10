const mongoose = require('mongoose')

const dbConnection = async () => {
  try {
    mongoose.connect(
      process.env.MONGODB_CNN,
      { useNewUrlParser: true },
      (err, res) => {
        if (err) throw err
        console.log('Base de Datos ONLINE')
      }
    )
  } catch (error) {
    console.log(error)
    throw new Error('Error en la conexión con la base de datos')
  }
}

module.exports = {
  dbConnection,
}
