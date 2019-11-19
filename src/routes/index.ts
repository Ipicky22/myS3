import { Router, Request, Response } from 'express';
import user from './user'

const app = Router();

app.get('/', (req: Request, res: Response) => {
    res.json({
        'project Name': 'myS3',
        author: ['Adrien Masson', 'Maxime Gouénard'],
    });
});

app.use("/user", user);

export default app;