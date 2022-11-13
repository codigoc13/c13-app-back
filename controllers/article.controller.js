const { request, response } = require('express')
const { DateTime } = require('luxon')

const { Article } = require('../models')

const createArticle = async (req = request, res = response) => {
    try {
        res.json({
            ok: 'Esta llegando a createArticle'
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