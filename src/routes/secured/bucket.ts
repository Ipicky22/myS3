import { Router, Request, Response } from "express";
import { getRepository } from 'typeorm';
import { Bucket } from "../../database/entity/Bucket";
import jwt from "jsonwebtoken";

var fs = require('fs');
const uuid = require('uuid');

const app = Router();
const secret = process.env.SUPERSECRET as string;

// CREATE bucket by uuid
app.post("/create", async (req: Request, res: Response) => {

    const { name, user, token } = req.body;

    jwt.verify(req.body.token, process.env.SUPERSECRET as string, async (err: Error, decoded: any) => {
        if (err) {
            res.status(400).json({ error: 'Token error : ' + err.message });
        } else {
            try {

                const dir = process.env.STORAGE + "/" + user + "/" + name

                if (!fs.existsSync(dir)) {

                    const bucket: Bucket = new Bucket();
                    bucket.uuid = uuid.v4();
                    bucket.name = name;
                    bucket.user = user;
                    await getRepository(Bucket).save(bucket);

                    res.status(201).json({ data: { bucket }, meta: { token } });
                    fs.mkdirSync(dir);
                } else {
                    console.log("The bucket " + dir + " could not be created.");
                    res.send("The bucket " + dir + " could not be created.").end();
                }

            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }
    });
});

// GET bucket by uuid
app.get('/:uuid', async (req: Request, res: Response) => {
    const uuid: string = req.params.uuid;
    const bucket: Bucket | undefined = await getRepository(Bucket).findOne(uuid);
    if (bucket) {
        res.send(bucket).end();
    } else {
        res.send(`Bucket n° ${uuid} was not found.`).end();
    }
});

// PATCH update bucket
app.patch('/:uuid', async (req: Request, res: Response) => {

    const { name, user } = req.body;

    jwt.verify(req.body.token, process.env.SUPERSECRET as string, async (err: Error, decoded: any) => {
        if (err) {
            res.status(400).json({ error: 'Token error : ' + err.message });
        } else {
            
            const uuid: string = req.params.uuid;
            const updateBucket: Bucket | undefined = req.body;
            const bucket: Bucket | undefined = await getRepository(Bucket).findOne(uuid);
            if (bucket && updateBucket) {

                const dir_old = process.env.STORAGE + "/" + user + "/" + bucket.name
                const dir = process.env.STORAGE + "/" + user + "/" + name
                
                if (!fs.existsSync(dir)) {

                    getRepository(Bucket).merge(bucket, updateBucket);
                    await getRepository(Bucket).save(bucket);

                    fs.rename(dir_old, dir, function (err: Error) {
                        if (err) throw err;
                        fs.stat(dir, function (err: Error, stats: any) {
                            if (err) throw err;
                            console.log('stats: ' + JSON.stringify(stats));
                        });
                    });

                } else {
                    console.log("The bucket " + dir + " could not be created.");
                    res.send("The bucket " + dir + " could not be created.").end();
                }

                res.send(`Bucket n° ${uuid} has been updated.`).end();
            } else {
                res.send(`Bucket n° ${uuid} was not found.`).end();
            }
        }
    });

});

// DELETE bucket by uuid
app.delete('/:uuid', async (req: Request, res: Response) => {

    jwt.verify(req.body.token, process.env.SUPERSECRET as string, async (err: Error, decoded: any) => {
        if (err) {
            res.status(400).json({ error: 'Token error : ' + err.message });
        } else {
            const uuid: string = req.params.uuid;
            const bucket: Bucket | undefined = await getRepository(Bucket).findOne(uuid);
            if (bucket) {
                await getRepository(Bucket).delete(uuid);
                res.send(`Bucket n° ${uuid} has been deleted.`).end();
            } else {
                res.send(`Bucket n° ${uuid} was not found.`).end();
            }
        }
    });

});

// GET All buckets
app.get('/', async (req: Request, res: Response) => {
    const buckets: Bucket[] | undefined = await getRepository(Bucket).find();
    res.send(buckets).end();
});

// DELETE all buckets
app.delete('/', async (req: Request, res: Response) => {
    await getRepository(Bucket).clear();
    res.send(`Bucket has been deleted.`).end();
});

export default app;
