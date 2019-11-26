import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import marked from 'marked';
import fs from 'fs';
import api from './routes/';

const app = express();

app.use(passport.initialize());
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());

app.get("/", (request: Request, response: Response) => {
  const file: String = fs.readFileSync('./README.md', 'utf8');
  response.send(marked(file.toString()));
})

app.use("/api", api);

export default app