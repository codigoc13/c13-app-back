const { request, response } = require('express')
const { DateTime } = require('luxon') 

const deleteArticle = async (req = request, res = response)
    try {
        
        const deletedArticle = await Article.findByIdAndUpdate(
            id, 
            {
                status: false
            },
            {
                new: true
            }
        )

        res.status(200).json({
            deletedArticle,
          })

    } catch (error) {
        console.log(error)
    return res.status(500).json({
      msg: 'Error en el servidor',
    })
  }    

  module.exports = {
    deleteArticle
  }