module.exports = {

      "type": process.env.MYSQL_TYPE,
      "host": process.env.MYSQL_HOST,
      "port": process.env.MYSQL_PORT,
      "username": process.env.MYSQL_USER,
      "password": process.env.MYSQL_PASSWORD,
      "database": process.env.MYSQL_DATABASE,
      "synchronize": false,
      "logging": false,
      "entities": [
         "src/database/entity/**/*.ts"
      ],
      "migrations": [
         "src/migration/**/*.ts"
      ],
      "subscribers": [
         "src/subscriber/**/*.ts"
      ],
      "cli": {
         "entitiesDir": "src/database/entity",
         "migrationsDir": "src/migration",
         "subscribersDir": "src/subscriber"
      }

}
