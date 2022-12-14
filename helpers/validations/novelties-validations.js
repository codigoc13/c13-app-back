const { Novelty } = require('../../models')
const { isObjectId } = require('../validate-object-id')

const isValidTitleNovelty = async (title = '') => {
  const novelty = await Novelty.findOne({ title: title.toLowerCase().trim() })
  if (novelty) {
    throw new Error(`Ya existe una noticia con el título '${title}'`)
  }
}

const noveltytByIdExists = async (id = '') => {
  if (isObjectId(id)) {
    const noveltyExists = await Novelty.findById(id)
    if (!noveltyExists) {
      throw new Error(`Noticia con id '${id}' no existe en la base de datos`)
    }
  }
}

module.exports = {
  isValidTitleNovelty,
  noveltytByIdExists,
}
