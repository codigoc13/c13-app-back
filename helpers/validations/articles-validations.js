const { Article } = require('../../models')
const { isObjectId } = require('../validate-object-id')

const articleByIdExists = async (id = '') => {
  if (isObjectId(id)) {
    const articleExists = await Article.findById(id)
    if (!articleExists)
      throw new Error(`Artículo con id '${id}' no existe en la base de datos `)
  }
}

const articleTitleExists = async (title = '') => {
  if (typeof title === 'string') {
    title = title.toLowerCase()
    const article = await Article.findOne({ title })
    if (article) throw new Error(`Ya existe un artículo con título '${title}'`)
  }
}

module.exports = {
  articleByIdExists,
  articleTitleExists,
}
