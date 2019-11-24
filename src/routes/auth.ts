import { Router } from "express";
import { getManager, getRepository } from 'typeorm';
import { User } from "../database/entity/User";
import jwt from "jsonwebtoken";
import passport from "passport";

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

    await getRepository(User).save(user);
    const payload = { id: user.uuid, nickname, email };
    console.log(payload);
    const token = jwt.sign(payload, process.env.SUPERSECRET);
    console.log(token);

    response.status(201).json({ data: { user }, meta: { token } });
  }catch (error) {
    response.status(400).json({ error: error.message });
  }
});

app.post("/login", async (request, response, next) => {
  passport.authenticate("local", {session: false }, async (error, user) => {
    console.log(user)
      if(error) {
        response.status(400).json({
          error: {message: error}
        });
        return response.status(400);
      }
      const { uuid, nickname, email } = user;
      const payload = { uuid, nickname, email };
      const token = jwt.sign(payload, process.env.SUPERSECRET);
      response.status(200).json({ data: {user}, meta: { token } });

  })(request, response, next);
});

export default app;
