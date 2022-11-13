const { request, response } = require('express')
const { DateTime } = require('luxon')
const { Article } = require('../models')

const createArticle = async (req = request, res = response) => {
    try {
        let { title, description } = req.body
        title = toLowerCase().trim()

        const articleBD = await Article.findOne({ title })
        if (articleBD) {
            return res.status(400).json({
                msg: ` Ya esxiste un articulo con el titulo ${title}`
            })
        }

        const data = {
            title,
            description,
            user: req.authenticatedUser.id,
            createAt: DateTime.now(),
        }

        const article = new Article(data)
        article.save()

        res.json({
            article
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Error'
        })
    }
}

module.exports = {
    createArticle
}