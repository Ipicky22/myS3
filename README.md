# myS3

## CREW
Maxime Gouénard - Adrien Masson

## LOCAL SETUP

- `npm install`
- Create **.env** file for :
```conf
  SERVER_PORT=YOUR_SERVER_PORT

  MYSQL_TYPE=mysql
  MYSQL_HOST=localhost
  MYSQL_PORT=YOUR_MYSQL_PORT
  MYSQL_USER=YOUR__MYSQL_USER
  MYSQL_PASSWORD=YOUR_MYSQL_PASSWORD
  MYSQL_DATABASE=YOUR_MYSQL_DATABASE

  GMAIL_USER=YOUR_FAKE_USER
  GMAIL_PASSWORD=YOUR_FAKE_PASSWORD
```
- Create **MYSQL** database called `YOUR_MYSQL_DATABASE`
```sql
CREATE DATABASE IF NOT EXISTS `YOUR_MYSQL_DATABASE` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `YOUR_MYSQL_DATABASE`;
```
- Create **ormconfig.js** to configure local DB connection, like this one :
```java
module.exports = {

      "type": process.env.MYSQL_TYPE,
      "host": process.env.MYSQL_HOST,
      "port": process.env.MYSQL_PORT,
      "username": process.env.MYSQL_USER,
      "password": process.env.MYSQL_PASSWORD,
      "database": process.env.MYSQL_DATABASE,
      "synchronize": true,
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
```
  **_To launch the project_**
- `npm run dev`

---

- **AUTH ENDPOINT**

| method       | endpoint              | body                                                        |  auth |
|--------------|-----------------------|-------------------------------------------------------------|-------|
| **POST**     | `/api/auth/register ` | body : { nickname, email, password }                        | none  |
| **POST**     | `/api/auth/login`     | body : { email, password }                                  | token |

---

- **USER ENDPOINT**

| method       | endpoint                       | body                                                              |  auth |
|--------------|--------------------------------|-------------------------------------------------------------------|-------|
| **GET**      | `/api/users/`                  |                                                                   | token |
| **GET**      | `/api/users/:uuid`             |                                                                   | token |
| **PATCH**    | `/api/users/:uuid`             | body : { nickname, email }                                        | token |
| **DELETE**   | `/api/users/:uuid`             |                                                                   | token |
| **DELETE**   | `/api/users/`                  |                                                                   | token |

---

- **BUCKET ENDPOINT**

| method       | endpoint                       | body                                                              |  auth |
|--------------|------------------------------- |-------------------------------------------------------------------|-------|
| **POST**     | `/api/buckets/create`          | body : { name, uuiUser }                                          | token |
| **GET**      | `/api/buckets/`                |                                                                   | token |
| **GET**      | `/api/buckets/:uuid`           |                                                                   | token |
| **PATCH**    | `/api/buckets/:uuid`           | body : { name }                                                   | token |
| **DELETE**   | `/api/buckets/:uuid`           |                                                                   | token |
| **DELETE**   | `/api/buckets/`                |                                                                   | token |

---

- **Mail Register**
https://nodemailer.com/about/

| method       | endpoint                           | body                                                              |  auth |
|--------------|------------------------------------|-------------------------------------------------------------------|-------|
| **POST**     | `/api/users/resetpassword/:uuid`   |                                                                   | token |
