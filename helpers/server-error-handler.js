const serverErrorHandler = (error, res) => {
  console.log(error)
  res.status(500).json({
    msg: 'Error en el servidor',
  })
}

module.exports = {
  serverErrorHandler,
}
