import { Router, Request, Response } from "express";
import { getRepository } from 'typeorm';
import { Bucket } from "../../database/entity/Bucket";
import jwt from "jsonwebtoken";
import fs from 'fs';

const app = Router();
const secret = process.env.SUPERSECRET as string;

// CREATE bucket
app.post("/", async (req: Request, res: Response) => {

    try {
      const { name } = req.body;
      const { uuid } = req.user;

      const dir = process.env.STORAGE + "/" + uuid + "/" + name

        if (!fs.existsSync(dir)) {

            const bucket: Bucket = new Bucket();
            bucket.name = name;
            bucket.user = uuid;
            await getRepository(Bucket).save(bucket);

            res.status(201).json({ data: { bucket } });
            fs.mkdirSync(dir);
        } else {
            console.log("The bucket " + dir + " could not be created.");
            res.send("The bucket " + dir + " could not be created.").end();
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET bucket by id
app.get('/:id', async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const bucket: Bucket | undefined = await getRepository(Bucket).findOne(id);
    if (bucket) {
        res.send(bucket).end();
    } else {
        res.send(`Bucket n° ${id} was not found.`).end();
    }
});

// PATCH update bucket
app.patch('/:id', async (req: Request, res: Response) => {

  const { name } = req.body;
  const { uuid } = req.user;

      const id: string = req.params.id;
      const updateBucket: Bucket | undefined = req.body;
      const bucket: Bucket | undefined = await getRepository(Bucket).findOne(id);
      if (bucket && updateBucket) {

          const dir_old = process.env.STORAGE + "/" + uuid + "/" + bucket.name
          const dir = process.env.STORAGE + "/" + uuid + "/" + name

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
          res.send(`Bucket n° ${id} has been updated.`).end();

      } else {
          res.send(`Bucket n° ${id} was not found.`).end();
      }
  });


// DELETE bucket by id
app.delete('/:id', async (req: Request, res: Response) => {

    const id: string = req.params.id;

    const bucket: Bucket | undefined = await getRepository(Bucket).findOne(id);
    if (bucket) {
        await getRepository(Bucket).delete(id);
        res.send(`Bucket n° ${id} has been deleted.`).end();
    } else {
        res.send(`Bucket n° ${id} was not found.`).end();
    }

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
