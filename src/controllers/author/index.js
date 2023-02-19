const db = require("../../models");
const AUTHOR = db.sequelize.model("author");
const { Op } = require('sequelize');

exports.getAuthors = async (req, res) => {
  try {

    const { filters } = req.query

    const page = !!filters && !!filters.page ? parseInt(filters.page) : 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const whereOperator = {
      deleted: 0
    }


    if (filters && !!filters.name) {
      whereOperator['name'] = {
        [Op.like]: `%${ filters.name }%`,
      }
    }

    const data = await AUTHOR.findAll({
      limit,
      offset,
      where: whereOperator
    });

    const count = await AUTHOR.count({
      where: whereOperator
    })


    res.json({ success: true, data: { tableData: data, count } });
  }
  catch (e) {

    return res.status(500).json({ success: false, error: { message: e.message } })

  }

};

exports.addAuthor = async (req, res) => {
  try {
    if (Object.keys(req.body).length > 0) {

      const author = await AUTHOR.create(req.body)

      return res.json({ success: true, data: { message: 'Author Created Successfully' } });

    }
    else {
      return res.status(500).json({ success: false, error: { message: 'No data to post' } })
    }
  }
  catch (e) {

    return res.status(500).json({ success: false, error: { message: e.message } })

  }
};

exports.updateAuthor = async (req, res) => {
  try {
    if (Object.keys(req.body).length > 0) {

      const { id } = req.body

      const author = await AUTHOR.update(req.body, { where: { id } })

      return res.json({ success: true, data: { message: 'Author Updated Successfully' } });


    }
    else {
      return res.status(500).json({ success: false, error: { message: 'No data to post' } })
    }
  }
  catch (e) {

    return res.status(500).json({ success: false, error: { message: e.message } })

  }
};

exports.getAuthorDetails = async (req, res) => {
  try {

    const authorId = req.params.authorId

    const data = await AUTHOR.findOne({
      where: { id: authorId },
    });

    res.json({ success: true, data });
  }
  catch (e) {
    res.json({ success: false, error: e.message });
  }
};
