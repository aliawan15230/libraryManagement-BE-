const Sequelize = require("sequelize");
const path = require("path");
const fs = require("fs");
const basename = path.basename(__filename);
const db = {};
const MYSQL = require('../../config')['MYSQL'];

const sequelize = new Sequelize(MYSQL.database, MYSQL.username, MYSQL.password, MYSQL);

fs.readdirSync(__dirname + "/SQL")
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname + "/SQL", file))(
      sequelize,
      Sequelize
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db