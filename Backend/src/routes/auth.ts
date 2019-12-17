import { Router } from "express";
import { getManager, getRepository } from 'typeorm';
import { User } from "../database/entity/User";
import Mail from "../services/mail";
import { hashSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import nodemailer from "nodemailer";
import fs from "fs";

const uuid = require('uuid');
const app = Router();

app.post("/register", async (request, response) => {
  const { nickname, email, password } = request.body;
  try {

    const user = new User();
    user.uuid = uuid.v4();
    user.nickname = nickname;
    user.email = email;
    user.password = password;

    user.hashPassword();

    await getRepository(User).save(user);
    const payload = { id: user.uuid, nickname, email };
    const token = jwt.sign(payload, process.env.SUPERSECRET as string);

    const to: string = user.email;
    const subject: string = 'Welcome to myS3';
    const message: string = "Congratulations! You've successfully created a myS3 account";

    const mail : Mail = new Mail(to, subject, message);
    mail.sendMail();

    const dir = process.env.STORAGE + "/" + user.uuid
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    } else {
        console.log("The folder " + dir + " could not be created.");
    }

    response.status(201).json({ data: { user }, meta: { token } });

  }catch (error) {
    response.status(400).json({ error: error.message });
  }
});

app.post("/login", async (request, response, next) => {
  passport.authenticate("local", { session: false }, async (error, user) => {
      if(error) {
        response.status(400).json({
          error: { message: error }
        });
        return response.status(400);
      }
      const { nickname, email, password } = user;

      if (!user.checkIfUnencryptedPasswordIsValid(request.body.password)) {
        return response.status(400).send('password wrong');
      }

      const payload = { nickname, email };
      const token = jwt.sign(payload, process.env.SUPERSECRET as string);

      response.status(200).json({ data: { user }, meta: { token } });

  })(request, response, next);
});

export default app;
