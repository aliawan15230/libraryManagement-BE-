const db = require("../../models");
const { Op } = require('sequelize');
const BOOKS = db.sequelize.model("books");
const LIBRARY = db.sequelize.model("library");
const BOOK_LIBRARY_ASSOCIATION = db.sequelize.model("book_library_association");

BOOKS.belongsToMany(LIBRARY, {
  through: BOOK_LIBRARY_ASSOCIATION,
  as: "details",
  foreignKey: "book_id"
});

LIBRARY.belongsToMany(BOOKS, {
  through: BOOK_LIBRARY_ASSOCIATION, as: "details",
  foreignKey: "library_id"
});

exports.getBookLibraries = async (req, res) => {

  const bookId = req.params.bookId

  const { filters } = req.query

  const page = !!filters && !!filters.page ? parseInt(filters.page) : 1;

  const limit = 20;

  const offset = (page - 1) * limit;

  const data = await BOOKS.findAll({
    limit,
    offset,
    where: { id: bookId },
    include: [
      {
        model: LIBRARY,
        as: "details",
        attributes: ['name', 'address',"id"]
      },
    ],
  });

  res.json({ success: true, data });
};

exports.getAllLibraries = async (req, res) => {

  const { filters } = req.query

  const page = !!filters && !!filters.page ? parseInt(filters.page) : 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const whereOperator = {
    deleted: 0
  }

  if (!!filters.name && filters) {
    whereOperator['name'] = {
      [Op.like]: `%${ filters.name }%`,
    }
  }

  const data = await LIBRARY.findAll({
    limit,
    offset,
    where: whereOperator,
    attributes: ['name', 'address', 'id']
  });

  const count = await LIBRARY.count({
    where: whereOperator,
  });

  res.json({ success: true, data: { tableData: data, totalCounts: count } });

};

exports.addLibrary = async (req, res) => {
  try {
    if (Object.keys(req.body).length > 0) {

      const library = await LIBRARY.create(req.body)

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

exports.updateLibrary = async (req, res) => {
  try {
    if (Object.keys(req.body).length > 0) {

      const { id } = req.body

      const lib = await LIBRARY.update(req.body, { where: { id } })

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

exports.getLibraryDetails = async (req, res) => {
  try {

    const libraryId = req.params.libraryId

    const data = await LIBRARY.findOne({
      where: { id: libraryId },
    });

    res.json({ success: true, data });
  }
  catch (e) {
    res.json({ success: false, error: e.message });
  }
};