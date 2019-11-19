import express, { Application, Request, Response } from 'express'
import bodyParser from 'body-parser'
import createUser from './app'
const app: Application = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', async function (req: Request, res: Response) {
    res.send('Hello')
})

app.post('/addUser', async function (req: Request, res: Response) {
    const { nickname, email, password } = req.body
    createUser(nickname, email, password)
    res.sendStatus(200).end()
})

app.listen(4000, () => console.log('Server running'))
