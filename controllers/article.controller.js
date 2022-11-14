const { request, response } = require("express");
const { DateTime } = require("luxon");
const { Article } = require("../models");

const createArticle = async (req = request, res = response) => {
  try {
    let { title, description } = req.body;
    title = title.toLowerCase().trim();

    const articleBD = await Article.findOne({ title });
    if (articleBD) {
      return res.status(400).json({
        msg: `Ya esxiste un articulo con el titulo ${title}`,
      });
    }

    const data = {
      title,
      description,
      user: req.authenticatedUser.id,
      createAt: DateTime.now(),
    };

    const article = new Article(data);
      await article.save();

    res.json({
      article,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error en el servidor",
    });
  }
};

const findAllArticles = async (req = request, res = response) => {
  try {
    let { from = 0, lot = 10 } = req.query;
    from = from <= 0 || isNaN(from) ? 0 : from - 1;

    const query = { status: true };

    const [articles, total] = await Promise.all([
      Article.find(query).populate("user").skip(from).limit(lot),
      Article.countDocuments(query),
    ]);

    const quantity = articles.length;
    const pagination = {
      from: Number(from + 1),
      lot: Number(lot),
    };

    res.json({
      total,
      quantity,
      pagination,
      articles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error en el servidor",
    });
  }
};

const updateArticle = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { status, createAt, ...data } = req.body;
    data.title = data.name.toLowerCase().trim();

    const articleBD = await Article.findOne({ title: data.title });
    if (articleBD) {
      return res.status(400).json({
        msg: `El articulo con ${articleBD.title} ya existe`,
      });
    }

    const article = await Article.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      article,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error en el servidor",
    });
  }
};

const deleteArticle = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const deleteArticle = await Article.findByIdAndDelete(
      id,
      {
        status: false,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      deleteArticle,
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
        msg: 'Error en el servidor'
    })
  }
};

module.exports = {
  createArticle,
  findAllArticles,
  updateArticle,
  deleteArticle,
};
