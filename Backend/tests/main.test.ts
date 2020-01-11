import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import express from 'express';
import http from 'http';

import 'babel-polyfill';
import app from '../src/app';
import User from '../src/database/entity/User';
import { createConnection, Connection } from 'typeorm';

require('dotenv').config();

const server = supertest(app);
let connection: Connection;

const serv = express();
serv.listen(4000, () => {
    console.log(`Server started at http://localhost:4000`);
});

beforeAll(async (done) => {

     const option: any = {

      "type": process.env.MYSQL_TYPE,
      "host": process.env.MYSQL_HOST,
      "port": process.env.MYSQL_PORT,
      "username": process.env.MYSQL_USER,
      "password": process.env.MYSQL_PASSWORD,
      "database": process.env.MYSQL_DATABASE_TEST,
      "synchronize": false,
      "logging": false,
      "entities": [
         "src/database/entity/**/*.ts",
      ]
    }

    connection = await createConnection(option);
    done();

});


// *************** Method GET app.ts *************** //
describe('Method Get index', () => {
  it('Check ReadMe => app.ts', async done => {
    const res: Response = await server.get('http://localhost:4000');
    expect(res.status).toBe(200);
    done();
  });
});

// *************** Method GET route/index.ts *************** //
describe('Method Get index /routes', () => {
  it('Check ReadMe => index.ts', async(done) => {
    const res: Response = await server.get('/api/')
    expect(res.status).toBe(200);
    done();
  });
});


// *************** Methods route/auth.ts *************** //
describe('Routes Auth', () => {

  let uuid;
  let token;

  const userTestRegister: User = new User();
  userTestRegister.nickname = 'Santa Claus';
  userTestRegister.email = 'santaClause@noel.com';
  userTestRegister.password = 'SantaClaussPassword';


  it('Check Register => auth.ts', async(done) => {
    const res: Response = await server
    .post('/api/auth/register')
    .send(userTestRegister)
    expect(res.status).toBe(201);
    done();

     uuid = res.body.data.user.uuid;
     token = res.body.meta.token;

  });

  const userTestLogin: User = new User();
  userTestLogin.email = userTestRegister.email;
  userTestLogin.password = userTestRegister.password;

  it('Check Login => auth.ts', async(done) => {
    const res: Response = await server
    .post('/api/auth/login')
    .send(userTestLogin)
    expect(res.status).toBe(200);
    done();
  });


  describe ('Routes User', () => {

    it('Get user => user.ts', async(done) => {
      const res: Response = await server.get(`/api/auth/users/${uuid}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200);
      done();
    })

  });

});


afterAll(async done => {
  await connection.close();
  done();
});
