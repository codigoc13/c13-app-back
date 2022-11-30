const { DateTime } = require('luxon')
const { request, response } = require('express')

const { Article } = require('../models')
const { serverErrorHandler } = require('../helpers')

const create = async (req = request, res = response) => {
  try {
    const { description, title } = req.body

    const data = {
      createdAt: DateTime.now(),
      description: description.toLowerCase().trim(),
      title: title.toLowerCase().trim(),
      user: req.authenticatedUser.id,
    }

    const article = new Article(data)
    await article.save()

    res.json({
      article,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const findAll = async (req = request, res = response) => {
  try {
    let { from = 0, lot = 10 } = req.query
    from = from <= 0 || isNaN(from) ? 0 : from - 1
    lot = lot <= 0 || isNaN(lot) ? 10 : lot

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
    serverErrorHandler(error, res)
  }
}

const update = async (req = request, res = response) => {
  try {
    let { title, description } = req.body

    const data = {
      updatedAt: DateTime.now(),
    }

    if (title) {
      title = title.toLowerCase().trim()

      const articleBD = await Article.findOne({ title })
      if (articleBD) {
        return res.status(400).json({
          msg: `El artículo ${articleBD.title} ya existe`,
        })
      }
      data.title = title
    }

    if (description) data.description = description.toLowerCase().trim()
    const article = await Article.findByIdAndUpdate(req.params.id, data, {
      new: true,
    })

    res.status(200).json({
      article,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const deleteById = async (req = request, res = response) => {
  try {
    const { id } = req.params
    const query = { status: false, updatedAt: DateTime.now() }

    const deleteArticle = await Article.findByIdAndUpdate(id, query, {
      new: true,
    })

    res.status(200).json({
      deleteArticle,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

module.exports = {
  create,
  findAll,
  update,
  deleteById,
}
