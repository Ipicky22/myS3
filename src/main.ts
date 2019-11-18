// export function helloWorld(lang = 'Typescript'): string {
//     return `🦁 I love ${lang}!`
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function devNull(): any {
//     return { hello: 'Efrei' }
// }

// console.log(helloWorld())

import express, { Application, Request, Response } from 'express'

const app: Application = express()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello')
})

app.listen(4000, () => console.log('Server running'))
