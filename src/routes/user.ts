import { Router, Request, Response } from "express";
import { User } from './../entity/User'
import { getManager, getRepository } from 'typeorm'
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

    await getRepository(User).save(user)

    console.log('Saved a new user with id: ' + user.uuid)
    console.log('Loading users from the database...')
    const users: User[] | undefined = await getManager().find(User)
    console.log('Loaded users: ', users)
    res.send(users).end()
})

app.get('/findAll', async (req: Request, res: Response) => {
    const users: User[] | undefined = await getManager().find(User)
    console.log('Users: ', users)
    res.send(users).end()
})

app.get('/findOne/:uuid', async (req: Request, res: Response) => {
    const uuid: string = req.params.uuid
    const user: User | undefined = await getRepository(User).findOne(uuid)
    console.log('User: ', user)
    res.send(user).end()
})

app.patch('/updateOne/:uuid', async (req: Request, res: Response) => {
    const uuid: string = req.params.uuid
    const user: User | undefined = await getRepository(User).findOne(uuid)
    console.log("user", user)
    if (user) {
        getRepository(User).merge(user, req.body)
        await getRepository(User).save(user)
        res.send(`User n° ${uuid} has been updated.`).end()
    } else {
        res.send(`User n° ${uuid} was not found.`).end()
    }
    
})

app.delete('/deleteOne/:uuid', async (req: Request, res: Response) => {
    const uuid: string = req.params.uuid
    await getRepository(User).delete(uuid)
    res.send(`User n° ${uuid} has been deleted.`).end()
})

app.delete('/deleteAll', async (req: Request, res: Response) => {
    await getRepository(User).clear()
    res.send(`Users has been deleted.`).end()
})

export default app;