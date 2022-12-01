const { Novelty } = require('../../models')

const isValidTitle = async (title = '') => {
  const novelty = await Novelty.findOne({ title: title.toLowerCase().trim() })
  if (novelty) {
    throw new Error(`Ya existe una noticia con el título '${title}'`)
  }
}

module.exports = {
  isValidTitle,
}
