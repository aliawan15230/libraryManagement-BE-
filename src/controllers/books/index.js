const db = require("../../models");
const { Op } = require('sequelize');
const BOOKS = db.sequelize.model("books");
const AUTHOR = db.sequelize.model("author");
const BOOK_LIBRARY_ASSOCIATION = db.sequelize.model('book_library_association')
const LIBRARY = db.sequelize.model("library");

BOOKS.belongsTo(AUTHOR, { foreignKey: "author_id", as: "authorDetail" });

BOOKS.belongsToMany(LIBRARY, {
  through: BOOK_LIBRARY_ASSOCIATION,
  as: "libraryDetails",
  foreignKey: "book_id"
});

LIBRARY.belongsToMany(BOOKS, {
  through: BOOK_LIBRARY_ASSOCIATION, as: "libraryDetails",
  foreignKey: "library_id"
});

exports.getBooks = async (req, res) => {

  try {

    const { filters } = req.query

    const page = !!filters && !!filters.page ? parseInt(filters.page) : 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const data = await BOOKS.findAll({
      where: {
        deleted: 0
      },
      limit,
      offset,
      include: [{
        model: AUTHOR,
        as: "authorDetail"
      }]
    });

    const count = await BOOKS.count({
      where: {
        deleted: 0
      },
    });

    res.json({ success: true, data: { tableData: data, count } });

  }
  catch (e) {
    res.json({ success: false, error: e.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    if (Object.keys(req.body).length > 0) {

      db.sequelize.transaction(async (t) => {

        const book = await BOOKS.create(req.body, { transaction: t })

        if (req.body.library && req.body.library.length > 0) {

          for (let i = 0; i < req.body.library.length; i++) {
            await BOOK_LIBRARY_ASSOCIATION.create({
              book_id: book.id,
              library_id: req.body.library[i]
            }, { transaction: t })
          }
        }

        return book;
      })
        .then(data => {
          return res.json({ success: true, data: { message: 'Book Created Successfully' } });
        })
        .catch(error => {
          res.status(500).json({ success: false, error: error.message });
          console.error('Transaction error:', error);
        });

    }
    else {
      return res.status(500).json({ success: false, error: { message: 'No data to post' } })
    }
  }
  catch (e) {
    return res.status(500).json({ success: false, error: { message: e.message } })

  }
};

exports.updateBook = async (req, res) => {
  try {
    if (Object.keys(req.body).length > 0) {

      const { id } = req.body

      db.sequelize.transaction(async (t) => {

        const book = await BOOKS.update(req.body, { where: { id } }, { transaction: t })

        if (req.body.library && req.body.library.length > 0) {

          await BOOK_LIBRARY_ASSOCIATION.destroy({
            where: {
              book_id: id,
              library_id: {
                [Op.notIn]: req.body.library
              }
            }
          }, { transaction: t })


          for (let i = 0; i < req.body.library.length; i++) {
            await BOOK_LIBRARY_ASSOCIATION.findOrCreate({
              where: {
                book_id: id,
                library_id: parseInt(req.body.library[i])
              },
              transaction: t
            },)
          }

        }
        return book;
      })
        .then(data => {
          return res.json({ success: true, data: { message: 'Book Updated Successfully' } });
        })
        .catch(error => {
          res.status(500).json({ success: false, error: error.message });
          console.error('Transaction error:', error);
        });

    }
    else {
      return res.status(500).json({ success: false, error: { message: 'No data to post' } })
    }
  }
  catch (e) {

    return res.status(500).json({ success: false, error: { message: e.message } })

  }
};

exports.getBookDetails = async (req, res) => {
  try {

    const bookId = req.params.bookId

    const data = await BOOKS.findOne({
      where: { id: bookId },
      include: [{
        model: AUTHOR,
        as: "authorDetail"
      },
        {
          model: LIBRARY,
          as: "libraryDetails"
        }]
    });

    res.json({ success: true, data });
  }
  catch (e) {
    res.json({ success: false, error: e.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    if (Object.keys(req.body).length > 0) {

      const id = req.params.bookId

      db.sequelize.transaction(async (t) => {

        const book = await BOOKS.update({ deleted: 1 }, { where: { id: parseInt(id) } }, { transaction: t })

        await BOOK_LIBRARY_ASSOCIATION.destroy({
          where: {
            book_id: id,
          }
        }, { transaction: t })


        return book;
      })
        .then(data => {
          return res.json({ success: true, data: { message: 'Book Deleted Successfully' } });
        })
        .catch(error => {
          res.status(500).json({ success: false, error: error.message });
          console.error('Transaction error:', error);
        });

    }
    else {
      return res.status(500).json({ success: false, error: { message: 'No data' } })
    }
  }
  catch (e) {
    return res.status(500).json({ success: false, error: { message: e.message } })

  }
};