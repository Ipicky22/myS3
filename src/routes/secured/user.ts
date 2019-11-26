import { Router, Request, Response } from "express";
import { getManager, getRepository, repository } from 'typeorm';
import { User } from "../../database/entity/User";
import jwt from "jsonwebtoken";

const uuid = require('uuid');
const app = Router();

// GET user by uuid
app.get('/:uuid', async (req: Request, res: Response) => {
    const uuid: string = req.params.uuid;
    const user: User | undefined = await getRepository(User).findOne(uuid);
    if(user) {
        res.send(user).end();
    } else {
      res.send(`User n° ${uuid} was not found.`).end();
    }
});

// PATCH update user
app.patch('/:uuid', async (req: Request, res: Response) => {

  jwt.verify(req.body.token,process.env.SUPERSECRET, async (err,decoded) => {
    if (err) {
      res.status(400).json({ error: 'Token error : ' + err.message });
    } else {
      const uuid: string = req.params.uuid;
      const updateUser: User | undefined = req.body;
      const user: User | undefined = await getRepository(User).findOne(uuid);
      if (user) {
          getRepository(User).merge(user, updateUser);
          await getRepository(User).save(user);
          res.send(`User n° ${uuid} has been updated.`).end();
      } else {
          res.send(`User n° ${uuid} was not found.`).end();
      }
    }
  });

});

// DELETE user by uuid
app.delete('/:uuid', async (req: Request, res: Response) => {

  jwt.verify(req.body.token,process.env.SUPERSECRET, async (err,decoded) => {
    console.log(req.body)
    if (err) {
      res.status(400).json({ error: 'Token error : ' + err.message });
    } else {
      const uuid: string = req.params.uuid;
      const user: User | undefined = await getRepository(User).findOne(uuid);
      if(user) {
        await getRepository(User).delete(uuid);
        res.send(`User n° ${uuid} has been deleted.`).end();
      } else {
        res.send(`User n° ${uuid} was not found.`).end();
      }
    }
  });

});

// GET All users
app.get('/', async (req: Request, res: Response) => {
    const users: User[] | undefined = await getRepository(User).find();
    res.send(users).end();
});

// DELETE all users
app.delete('/', async (req: Request, res: Response) => {
    await getRepository(User).clear();
    res.send(`Users has been deleted.`).end();
});

export default app;
