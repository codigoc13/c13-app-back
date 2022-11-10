const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const { dbConnection } = require('../database/config.db')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT

    this.paths = {
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      search: '/api/search',
      uploads: '/api/uploads',
      users: '/api/users',
      invoices: '/api/invoices',
    }

    // Conectar a base datos
    this.conectarDB()

    // Middlewares
    this.middlewares()

    // Rutas de mi app
    this.routes()
  }

  conectarDB() {
    dbConnection()
  }

  middlewares() {
    // CORS
    this.app.use(cors())

    // Lectura y parseo del body
    this.app.use(express.json())

    // Directorio público
    this.app.use(express.static('public'))

    // Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
      })
    )
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth.routes'))
    this.app.use(this.paths.categories, require('../routes/category.routes'))
    this.app.use(this.paths.products, require('../routes/product.routes'))
    this.app.use(this.paths.search, require('../routes/search.routes'))
    this.app.use(this.paths.uploads, require('../routes/upload.routes'))
    this.app.use(this.paths.users, require('../routes/user.routes'))
    this.app.use(this.paths.invoices, require('../routes/invoice.routes'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`)
    })
  }
}

module.exports = Server
