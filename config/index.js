require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8000,
  MYSQL: {
    "username": process.env.MYSQL_USERNAME,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOSTNAME,
    "dialect": "mysql",
    "timezone": process.env.MYSQL_TIMEZONE,
    "logging": false,
    "pool": {
      "min": Number(process.env.MYSQL_POOL_MIN) || 0,
      "max": Number(process.env.MYSQL_POOL_MAX) || 10,
      "acquire": 30000,
      "idle": 10000,
      "evict": 10000
    }
  }
  

};
