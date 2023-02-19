const express = require("express");
const app = express();
const config = require("./config");
const booksRouter = require("./src/routes/books");
const libraryRouter = require("./src/routes/library");
const authorRouter = require('./src/routes/author')
const bodyParser = require('body-parser');

const cors = require('cors')

app.use(cors())

app.use(bodyParser.json({ limit: '25mb' }));

app.use('/books', booksRouter)

app.use('/library', libraryRouter)

app.use('/author', authorRouter)


app.listen(config.PORT, () => {
  console.log("Application listening on", config.PORT);
});
