import { Router, Request, Response } from 'express';
import passport from 'passport';
import auth from './auth';
import secured from './secured/';

const app = Router();

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        'Project Name': 'myS3',
        author: ['Adrien Masson', 'Maxime Gouénard'],
    });
});

app.use("/auth", auth);
app.use("/", passport.authenticate("jwt", {session: false}), secured);

export default app;
