const { request, response } = require('express')
const { DateTime } = require('luxon')
const { Article } = require('../models')

const create = async (req = request, res = response) => {
  try {
    let { title, description } = req.body
    title = title.toLowerCase().trim()
    description = description.toLowerCase().trim()

    const articleBD = await Article.findOne({ title })
    if (articleBD) {
      return res.status(400).json({
        msg: `Ya existe un artículo con el titulo ${title}`,
      })
    }

    const data = {
      title,
      description,
      user: req.authenticatedUser.id,
      createdAt: DateTime.now(),
    }

    const article = new Article(data)
    await article.save()

    res.json({
      article,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const findAll = async (req = request, res = response) => {
  try {
    let { from = 0, lot = 10 } = req.query
    from = from <= 0 || isNaN(from) ? 0 : from - 1

    const query = { status: true }

    const [articles, total] = await Promise.all([
      Article.find(query).populate('user').skip(from).limit(lot),
      Article.countDocuments(query),
    ])

    const quantity = articles.length
    const pagination = {
      from: Number(from + 1),
      lot: Number(lot),
    }

    res.json({
      total,
      quantity,
      pagination,
      articles,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const update = async (req = request, res = response) => {
  try {
    let { title, description } = req.body

    const data = {
      description,
      updatedAt: DateTime.now(),
    }

    if (title) {
      title = title.toLowerCase().trim()

      const articleBD = await Article.findOne({ title: data.title })
      if (articleBD) {
        return res.status(400).json({
          msg: `El artículo ${articleBD.title} ya existe`,
        })
      }
      data.title = title
    }

    if (description) data.description = description

    const article = Article.findByIdAndUpdate(req.params.id, data, {
      new: true,
    })

    res.json({
      article,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const deleteById = async (req = request, res = response) => {
  try {
    const { id } = req.params

    const deleteArticle = await Article.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    )

    res.status(200).json({
      deleteArticle,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

module.exports = {
  create,
  findAll,
  update,
  deleteById,
}
