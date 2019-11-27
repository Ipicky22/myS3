import { Router, Request, Response } from "express";
import { getRepository } from 'typeorm';
import { User } from "../database/entity/User";
import { hashSync } from 'bcryptjs'
import jwt from "jsonwebtoken";
import passport from "passport";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

var fs = require('fs');
const uuid = require('uuid');
const app = Router();

app.post("/register", async (request: Request, response: Response) => {
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

        const token: String = jwt.sign(payload, process.env.SUPERSECRET as string);

        response.status(201).json({ data: { user }, meta: { token } });

        const testAccount: nodemailer.TestAccount = await nodemailer.createTestAccount();
        const transporter: Mail = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        const info = await transporter.sendMail({
            from: email,
            to: "mys3@efreiparis.fr",
            subject: "Welcome to myS3",
            text: "Hello world",
            html: "<b>Hello world</b>"
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        const dir = process.env.STORAGE + "/" + user.uuid

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        } else {
            console.log("The folder " + dir + " could not be created.");
        }

    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

app.post("/login", async (request: Request, response: Response, next) => {
    passport.authenticate("local", { session: false }, async (error: Error, user: any) => {
        if (error) {
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
