// export function helloWorld(lang = 'Typescript'): string {
//     return `🦁 I love ${lang}!`
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function devNull(): any {
//     return { hello: 'Efrei' }
// }

// console.log(helloWorld())

import express, { Application, Request, Response } from 'express'
import "reflect-metadata"

import {createConnection} from "typeorm";
import {User} from "./entity/User";

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));

const app: Application = express()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello')
})

app.listen(4000, () => console.log('Server running'))
