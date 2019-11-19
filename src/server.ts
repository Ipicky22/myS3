import express, { Application, Request, Response } from 'express'
import createUser from './app'
const app: Application = express()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello')
})

app.get('/addUser', (req: Request, res: Response) => {
    //createUser("test", "test@mail.com", "test")
})

app.listen(4000, () => console.log('Server running'))
