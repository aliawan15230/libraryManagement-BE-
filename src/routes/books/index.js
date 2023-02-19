const express = require("express");
const router = express.Router();

const books = require("../../controllers/books");

router.get("/", books.getBooks);

router.post('/', books.addBook)

router.put('/', books.updateBook)

router.put('/delete/:bookId', books.deleteBook)

router.get('/bookDetails/:bookId', books.getBookDetails)

module.exports = router;
