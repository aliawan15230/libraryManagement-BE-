const express = require("express");
const router = express.Router();

const library = require("../../controllers/library");
const books = require('../../controllers/books');

router.get("/libraries", library.getAllLibraries)

router.get("/bookLibraries/:bookId", library.getBookLibraries)

router.get("/libraryDetails/:libraryId", library.getLibraryDetails)

router.post('/', library.addLibrary)

router.put('/', library.updateLibrary)


module.exports = router;
