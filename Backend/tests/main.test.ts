import supertest from 'supertest';
import express from 'express';

const server = express();
const request = supertest(server);

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true)
  })
});

describe('Get index', () => {
  it('Simple check ReadMe', done => {
    const res: Response = request.get('/');
    expect(res.status).toEqual(200);
    done();
  });
});
