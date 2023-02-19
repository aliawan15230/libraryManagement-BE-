var DataTypes = require("sequelize").DataTypes;
var _book_library_association = require("./book_library_association");

function initModels(sequelize) {
  var book_library_association = _book_library_association(sequelize, DataTypes);


  return {
    book_library_association,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
