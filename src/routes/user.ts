import { Router, Request, Response } from "express";
import { User } from './../entity/User'
import { getManager } from 'typeorm'
const uuid = require('uuid')
const app = Router();

app.post('/addUser', async (req: Request, res: Response) => {
    const { nickname, email, password } = req.body

    console.log('Inserting a new user into the database...')

    const user: User = new User()
    user.uuid = uuid.v4()
    user.nickname = nickname
    user.email = email
    user.password = password

    await getManager().getRepository(User).save(user)

    console.log('Saved a new user with id: ' + user.uuid)
    console.log('Loading users from the database...')

    const users = await getManager().find(User)

    console.log('Loaded users: ', users)
    res.sendStatus(200).end()
})

export default app;