const express = require("express");
const router = express.Router();
const author = require("../../controllers/author");
const books = require('../../controllers/books');

router.get("/", author.getAuthors);

router.post("/", author.addAuthor);

router.put("/", author.updateAuthor);

router.get('/authorDetails/:authorId', author.getAuthorDetails)

module.exports = router;