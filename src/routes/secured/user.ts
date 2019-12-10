import { Router, Request, Response } from "express";
import { getRepository } from 'typeorm';
import { User } from "../../database/entity/User";
import Mail from "../../services/mail";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const app = Router();
const secret = process.env.SUPERSECRET as string;

// **************** GET user by uuid *************** //
app.get('/:uuid', async (req: Request, res: Response) => {

    const uuid: string = req.params.uuid;
    const user: User | undefined = await getRepository(User).findOne(uuid);
    if (user) {
        res.status(200).send(user).end();
    } else {
        res.status(400).send(`User n° ${uuid} was not found.`).end();
    }

});

// **************** EDIT user by uuid **************** //
app.patch('/:uuid', async (req: Request, res: Response) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.slice(6).trimLeft();

    jwt.verify(token, process.env.SUPERSECRET as string, async (err, decoded) => {
      if (err) {
        res.status(400).json({ error: 'Token error : ' + err.message });
      } else {
        const uuid: string = req.params.uuid;
        const updateUser: User | undefined = req.body;
        const user: User | undefined = await getRepository(User).findOne(uuid);
        if (user) {
          getRepository(User).merge(user, updateUser as User);
          await getRepository(User).save(user);
          res.status(200).send(`User n° ${uuid} has been updated.`).end();
        } else {
          res.status(400).send(`User n° ${uuid} was not found.`).end();
        }
      }
    });
  } else {
    console.log("req.headers.authorization was not found.")
  }
});

// **************** DELETE user by uuid **************** //
app.delete('/:uuid', async (req: Request, res: Response) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.slice(6).trimLeft()
    jwt.verify(token, process.env.SUPERSECRET as string, async (err, decoded) => {
      if (err) {
        res.status(400).json({ error: 'Token error : ' + err.message });
      } else {
        const uuid: string = req.params.uuid;
        const user: User | undefined = await getRepository(User).findOne(uuid);
        if (user) {
          await getRepository(User).delete(uuid);
          res.status(200).send(`User n° ${uuid} has been deleted.`).end();
        } else {
          res.status(400).send(`User n° ${uuid} was not found.`).end();
        }
      }
    });
  } else {
    console.log("req.headers.authorization was not found.")
  }
});

// **************** EDIT password user by uuid **************** //
app.patch('/password/:uuid', async (req: Request, res: Response) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.slice(6).trimLeft()
    jwt.verify(token, process.env.SUPERSECRET as string, async (err, decoded) => {
      if (err) {
        res.status(400).json({ error: 'Token error : ' + err.message });
      }
      else {
        const { oldpassword, newpassword } = req.body;

        if (!(oldpassword && newpassword)) {
          res.status(400).send();
        }

        if (oldpassword === newpassword) {
          return res.send(`password are the same`);
        }

        const uuid: string = req.params.uuid;
        const user: User | undefined = await getRepository(User).findOne(uuid);

        if (user && !user.checkIfUnencryptedPasswordIsValid(oldpassword)) {
          // 401 Unauthorized
          res.status(400).send('password wrong');
          return;
        }

        if (user) {
          user.password = newpassword;
          user.hashPassword();
          await getRepository(User).save(user);
          res.status(200).send(`User n° ${uuid} password has been updated.`).end();
        } else {
          res.status(400).send(`User n° ${uuid} was not found.`).end();
        }
      }
    });
  } else {
    console.log("req.headers.authorization was not found.")
  }
});

// **************** SEND mail user by uuid **************** //
app.post('/mailpassword/:uuid', async (req: Request, res: Response) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.slice(6).trimLeft()
    jwt.verify(token, process.env.SUPERSECRET as string, async (err, decoded) => {
      if (err) {
        res.status(400).json({ error: 'Token error : ' + err.message });
      } else {

        const uuid: string = req.params.uuid;
        const user: User | undefined = await getRepository(User).findOne(uuid);

        if (user) {
          const to: string = user.email;
          const subject: string = 'Reset password myS3';
          const message: string = "<b> Click on this link to change your password : <a href='https://www.google.com'> here <a/>";

          const mail : Mail = new Mail(to, subject, message);
          mail.sendMail();
        } else {
          console.log("Not find user")
        }
        res.status(200).json('Mail sent').end();
      }
    });
  } else {
    console.log("req.headers.authorization was not found.")
  }
});

// **************** NOT ASKED **************** //

// **************** GET All Users **************** //
app.get('/', async (req: Request, res: Response) => {
  const users: User[] | undefined = await getRepository(User).find();
  res.send(users).end();
});

// **************** DELETE All Users **************** //
app.delete('/', async (req: Request, res: Response) => {
  await getRepository(User).clear();
  res.send(`Users has been deleted.`).end();
});

export default app;
