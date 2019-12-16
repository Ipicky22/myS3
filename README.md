# myS3

## CREW
Maxime Gouénard - Adrien Masson

# Steps
### .step_01
- [X] Bootstrap an API server using express and typeORM with Typescript + Babel
- [X] You HAVE TO use snakecase and lowercase table names
- [X] Setup tests with **Jest**
- [ ] Setup docker container

### .step_02
- [X] A user is described with: uuid, nickname, email, password
- [X] Bootstrap all CRUD user operations
- [X] You HAVE TO use JWT
- [X] You HAVE TO send an email on user creation
- [X] Add user password reset e-mail workflow

### interlude
- [X] The file structure on your computer will be ~/myS3DATA/$USER_UUID/$BUCKET_NAME/$BLOB_NAME

### .step_03
- [X] A bucket is describe with: id, name and belongs to a user
- [X] Create routes which allows to create, edit and delete a bucket
- [X] Create a route which allow to list all objects from a bucket
- [X] Create a route which allow to check if a bucket exist with a head method that return 200 or 400

### .step_04
- [X] An object or a blob is describe with: id, name, path, size and belongs to a bucket
- [X] Create routes which allows to add and delete a blob using the package multer
- [ ] Create a route which allows to retrieve a blob
- [X] Create a route which allows to duplicate a blob by adding .copy.$NB before the file extension
- [X] Create a route which allow to get blob metadata. Infos: path and size

### .step_05
- [ ] Create a simple web interface with React

### bonus
- [ ] Add bucket and|or blob sharing permission (read|write)

### required
- [ ] Make sure test coverage is 100%
- [X] Don't forget to add .crew and .oav.name files

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

| method         | endpoint                       | body                                                              |  auth |
|----------------|--------------------------------|-------------------------------------------------------------------|-------|
| **GET**        | `/api/users/:uuid`             |                                                                   | token |
| **PATCH**      | `/api/users/:uuid`             | body : { nickname, email }                                        | token |
| **DELETE**     | `/api/users/:uuid`             |                                                                   | token |

---

- **BUCKET ENDPOINT**

| method         | endpoint                       | body                                                              |  auth |
|----------------|------------------------------- |-------------------------------------------------------------------|-------|
| **POST**       | `/api/users/:uuid/buckets`     | body : { name }                                                   | token |
| **GET**        | `/api/users/:uuid/buckets/:id` |                                                                   | token |
| **PATCH**      | `/api/users/:uuid/buckets/:id` | body : { name }                                                   | token |
| **DELETE**     | `/api/users/:uuid/buckets/:id` |                                                                   | token |

---

- **Mail Register**
https://nodemailer.com/about/

| method       | endpoint                           | body                                                              |  auth |
|--------------|------------------------------------|-------------------------------------------------------------------|-------|
| **POST**     | `/api/users/mailpassword/:uuid`    |                                                                   | token |
