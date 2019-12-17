import { Router, Request, Response } from "express";
import { getRepository, Like } from 'typeorm';
import Blob from "../../database/entity/Blob";
import Bucket from "../../database/entity/Bucket"
import multer from "multer";
import { createReadStream, createWriteStream, unlinkSync } from "fs";

const app = Router({
  mergeParams: true
});

const storage = multer.diskStorage({

  destination: async (req, file , cb) => {

    const { uuid, id } = JSON.parse(JSON.stringify(req)).params;
    const bucket : Bucket | undefined = await getRepository(Bucket).findOne(id);
    
    if ( bucket) {
    await cb(null, process.env.STORAGE + "/" + uuid + "/" + bucket.name)
    } else {
      console.log("bucket n'existe pas")
    }
  },

  filename: async (req, file, cb) => {
    await cb(null, file.originalname)
  },

});

const upload = multer({ storage })

// **************** CREATE Blob **************** //
app.post("/", upload.single("blob"), async (req: Request, res: Response) => {
  try {
    const { filename, path, size } = req.file;
    const { bucket_id } = req.params;

    const blob: any = new Blob();

    blob.name = filename;
    blob.path = path;
    blob.size = size;
    blob.bucket = bucket_id;

    await getRepository(Blob).save(blob);

    res.status(201).json({
      data: `Blob ${blob.name} has been successfully created`,
      meta: { status: 201 }
    });
  } catch (err) {
    res.status(400).json({ err });
  }

});

// **************** DELETE Blob **************** //
app.delete('/:id', async (req: Request, res: Response) => {

  const id: any = req.params.id ;
  const blob: Blob | undefined = await getRepository(Blob).findOne(id);

  if (blob) {
    try {
      unlinkSync(blob.path);
      console.log(`successfully deleted ${blob.path}`);
    } catch (err) {
      console.log(err)
    }
    await getRepository(Blob).delete(id);
    res.status(200).send(`Blob n° ${id} has been deleted.`).end();
  } else {
    res.status(404).send(`Blob n° ${id} was not found.`).end();
  }

});

// **************** GET Blob metadata **************** //
app.get('/metadata/:blob_id', async (req: Request, res: Response) => {

  const { blob_id } = req.params;
  const blob: Blob | undefined = await getRepository(Blob).findOne(blob_id, { select: ['path', 'size'] });

  if (blob) {
    res.send(blob).end();
  } else {
    res.send(`Blob n° ${blob_id} was not found.`).end();
  }

});

// **************** DUPLICATE Blob **************** //

app.get('/duplicate/:blob_id', async (req: Request, res: Response) => {

  try {

    const { uuid, bucket_id, blob_id } = req.params;
    console.log(req.params)

    const bucket: Bucket | undefined = await getRepository(Bucket).findOne(bucket_id);
    const blob: Blob | undefined = await getRepository(Blob).findOne(blob_id);

    if (blob) {

      const dir = blob.path.split('.');
      const regex = '%' + dir[0] + '%';
      const nbCopy: number = await getRepository(Blob).count({ where: { path: Like(regex) } });
      const copyField = dir[0] + '.copy.' + nbCopy + '.' + dir[1];

      const blobDuplicate: any = new Blob();

      blobDuplicate.name = blob.name;
      blobDuplicate.path = copyField;
      blobDuplicate.size = blob.size;
      blobDuplicate.bucket = bucket;
      
      await getRepository(Blob).save(blobDuplicate);

      createReadStream(blob.path).pipe(createWriteStream(copyField));
      res.status(200).send('duplicate');

    } else {
      res.status(404).send('Error');
    }

  } catch (err) {
    res.status(400).send(err);
  }

});

export default app;
