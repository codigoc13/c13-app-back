const { request, response } = require('express')

const validateFile = (req = request, res = response, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).json({
      msg: 'No hay archivos en la petición - validateFile',
    })
  }
  next()
}

module.exports = {
  validateFile,
}
