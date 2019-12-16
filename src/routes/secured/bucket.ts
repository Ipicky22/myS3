import { Router, Request, Response } from "express";
import { getRepository } from 'typeorm';
import Bucket from "../../database/entity/Bucket";
import fs from 'fs';
import rimraf from 'rimraf'

const app = Router();

// **************** HEAD **************** //
app.head('/:id', async (req: Request, res: Response) => {

    const id: string = req.params.id;
    const bucket: Bucket | undefined = await getRepository(Bucket).findOne(id);

    bucket ? res.sendStatus(200) : res.sendStatus(404);

});

// **************** CREATE Bucket **************** //
app.post("/", async (req: Request, res: Response) => {

    try {
        const { name } = req.body;
        const { uuid }: any = req.user;

        const dir = process.env.STORAGE + "/" + uuid + "/" + name

        if (!fs.existsSync(dir)) {

            const bucket: Bucket = new Bucket();
            bucket.name = name;
            bucket.user = uuid;
            await getRepository(Bucket).save(bucket);

            res.status(201).json({ data: { Bucket } });
            fs.mkdirSync(dir);

        } else {
            console.log("The bucket " + dir + " could not be created.");
            res.status(400).send("The bucket " + dir + " could not be created.").end();
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

// **************** EDIT Bucket by id **************** //
app.patch('/:id', async (req: Request, res: Response) => {

    const { name } = req.body;
    const { uuid }: any = req.user;

    const id: string = req.params.id;
    const updateBucket: Bucket | undefined = req.body;
    const bucket: Bucket | undefined = await getRepository(Bucket).findOne(id);
    if (bucket && updateBucket) {

        const dir_old = process.env.STORAGE + "/" + uuid + "/" + bucket.name
        const dir = process.env.STORAGE + "/" + uuid + "/" + name

        if (!fs.existsSync(dir)) {

            getRepository(Bucket).merge(bucket, updateBucket);
            await getRepository(Bucket).save(bucket);

            fs.rename(dir_old, dir, function (err) {
                if (err) throw err;
                fs.stat(dir, function (err, stats: any) {
                    if (err) throw err;
                    console.log('stats: ' + JSON.stringify(stats));
                });
            });

        } else {
            console.log("The bucket " + dir + " could not be created.");
            res.status(400).send("The bucket " + dir + " could not be created.").end();
        }
        res.status(200).send(`Bucket n° ${id} has been updated.`).end();

    } else {
        res.status(404).send(`Bucket n° ${id} was not found.`).end();
    }

});

// **************** DELETE Bucket by id **************** //
app.delete('/:id', async (req: Request, res: Response) => {

    const id: string = req.params.id;
    const { uuid }: any = req.user;
    const bucket: Bucket | undefined = await getRepository(Bucket).findOne(id);

    if (bucket) {
        const dir = process.env.STORAGE + "/" + uuid + "/" + bucket.name;
        rimraf(dir, () => {
            console.log("the directory is deleted");
        })
        await getRepository(Bucket).delete(id);
        res.status(200).send(`Bucket n° ${id} has been deleted.`).end();
    } else {
        res.status(404).send(`Bucket n° ${id} was not found.`).end();
    }

});

// **************** GET All return the list in a user's bucket **************** //
app.get('/', async (req: Request, res: Response) => {

    const { uuid }: any = req.user;
    const buckets: Bucket[] | undefined = await getRepository(Bucket).find({ where: { userUuid: uuid } });
    if (buckets) {
        res.status(200).send(buckets).end();
    } else {
        res.status(400).send(`User has no bucket. `).end();
    }
});



// **************** NOT ASKED **************** //

// **************** GET Bucket by id **************** //
app.get('/:id', async (req: Request, res: Response) => {

    const id: string = req.params.id
    const bucket: Bucket | undefined = await getRepository(Bucket).findOne(id);
    if (bucket) {
        res.send(bucket).end();
    } else {
        res.send(`Bucket n° ${id} was not found.`).end();
    }
});


export default app;
