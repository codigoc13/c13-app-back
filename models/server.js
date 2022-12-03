const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const { dbConnection } = require('../database/config.db')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT

    this.paths = {
      articles: '/api/articles',
      auth: '/api/auth',
      careers: '/api/careers',
      cohorts: '/api/cohorts',
      courses: '/api/courses',
      novelties: '/api/novelties',
      search: '/api/search',
      uploads: '/api/uploads',
      users: '/api/users',
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
    this.app.use(this.paths.articles, require('../routes/article.routes'))
    this.app.use(this.paths.auth, require('../routes/auth.routes'))
    this.app.use(this.paths.careers, require('../routes/career.routes'))
    this.app.use(this.paths.cohorts, require('../routes/cohort.routes'))
    this.app.use(this.paths.courses, require('../routes/course.routes'))
    this.app.use(this.paths.novelties, require('../routes/novelty.routes'))
    this.app.use(this.paths.search, require('../routes/search.routes'))
    this.app.use(this.paths.uploads, require('../routes/upload.routes'))
    this.app.use(this.paths.users, require('../routes/user.routes'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`)
    })
  }
}

module.exports = Server
