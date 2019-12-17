import supertest from 'supertest';
import 'babel-polyfill';
import app from '../src/app';
import User from '../src/database/entity/User';
import { createConnection, Connection } from 'typeorm';

require('dotenv').config();

const request = supertest(app);
let connection: Connection;


beforeAll(async (done) => {

     const option: any = {

      "type": process.env.MYSQL_TYPE,
      "host": process.env.MYSQL_HOST,
      "port": process.env.MYSQL_PORT,
      "username": process.env.MYSQL_USER,
      "password": process.env.MYSQL_PASSWORD,
      "database": process.env.MYSQL_DATABASE_TEST,
      "synchronize": false,
      "logging": true,
      "entities": [
         "src/database/entity/**/*.ts",
      ]
    }

    connection = await createConnection(option);
    done();

});


describe('Method Get index', () => {
  it('Check ReadMe => app.ts', done => {
    request
    .get('/')
    .expect(200, done)
  });
});


describe('Method Get index /routes', () => {
  it('Check ReadMe => index.ts', done => {
    request
    .get('/api/')
    .expect(200, done)
  });
});

describe('Routes auth', () => {

  const userTest: User = new User();
  userTest.nickname = 'Santa Claus';
  userTest.password = 'SantaClaussPassword';
  userTest.email = 'santaClause@noel.com';

  it('Check register => auth.ts', done => {
    request
    .post('/api/auth/register')
    .send(userTest)
    .expect(201, done)
  })
})


afterAll(async done => {
  await connection.close();
  done();
});
