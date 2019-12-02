import { Router, Request, Response } from "express";
import { getManager, getRepository, repository } from 'typeorm';
import { User } from "../../database/entity/User";
import Mail from "../../services/mail";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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
  const token = req.headers.authorization.slice(6).trimLeft();
  jwt.verify(token, process.env.SUPERSECRET, async (err,decoded) => {
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

// Send Email to change password
app.post('/resetpassword/:uuid', async(req: Request, res: Response) => {
 const token = req.headers.authorization.slice(6).trimLeft()
  jwt.verify(token, process.env.SUPERSECRET, async (err,decoded) => {
    if (err) {
      res.status(400).json({ error: 'Token error : ' + err.message });
    }  else {

      const uuid: string = req.params.uuid;
      const user: User | undefined = await getRepository(User).findOne(uuid);

      const to: string = user.email;
      const subject: string = 'Reset password myS3';
      const message: string = "<b> Click on this link to change your password : <a href='https://www.google.com'> here <a/>";

      const mail = new Mail(to, subject, message);
      mail.sendMail();
      // Query successfully processes. The actual response will depend on the request method used.
      res.status(200).json('Mail sent').end();
    }
  });

});

// PATCH password user
app.patch('/password/:uuid', async (req: Request, res: Response) => {
  const token = req.headers.authorization.slice(6).trimLeft()
  jwt.verify(token, process.env.SUPERSECRET, async (err, decoded) => {
    if(err) {
      res.status(400).json({ error: 'Token error : ' + err.message });
    }
    else {
      const { oldpassword, newpassword } =  req.body;

      if (!(oldpassword && newpassword)) {
        //400 Bad Request
        res.status(400).send();
      }

      if (oldpassword === newpassword) {
        return res.send(`password are the same`);
      }

      const uuid: string = req.params.uuid;
      const user: User | undefined = await getRepository(User).findOne(uuid);

      if (!user.checkIfUnencryptedPasswordIsValid(oldpassword)) {
        // 401 Unauthorized
        res.status(401).send('password wrong');
        return;
      }

      if (user) {
          user.password = newpassword;
          user.hashPassword();
          await getRepository(User).save(user);
          res.send(`User n° ${uuid} password has been updated.`).end();
      } else {
          res.send(`User n° ${uuid} was not found.`).end();
      }
    }
  });

});

// DELETE user by uuid
app.delete('/:uuid', async (req: Request, res: Response) => {
  const token = req.headers.authorization.slice(6).trimLeft()
  jwt.verify(token, process.env.SUPERSECRET, async (err,decoded) => {
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

// GET all users
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
