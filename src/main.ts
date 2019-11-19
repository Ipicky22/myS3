import Express from 'express'
import bodyParser from 'body-parser'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import route from './routes'

createConnection()
    .then(async connection => {
        const app: Express.Express = Express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use('/', route);

        const port = process.env.SERVER_PORT;
        const server: any = app.listen(port, () => {
            console.log(`server started at http://localhost:${port}`);
        });
    })
    .catch(error => console.log(error));