import app from '../src/app';
import supertest from 'supertest'

const server = supertest(app);

describe('Get index', () => {
  it('simple get home', done => {
    const res: Response = server.get('/');
    expect(res.status).toEqual(200);
    done();
  });
});
