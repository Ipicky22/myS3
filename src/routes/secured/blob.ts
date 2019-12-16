import { Router, Request, Response } from "express";
import { getRepository } from 'typeorm';
import Blob from "../../database/entity/Blob";
import Bucket from "../../database/entity/Bucket"
import multer from "multer";

const app = Router({
  mergeParams: true
});

const storage = multer.diskStorage({
  destination: async(req, file, cb) => {
    const { uuid, id } = req.params;
    const bucket = await getRepository(Bucket).findOne(id);
    cb(null, process.env.STORAGE + "/" + uuid + "/" + bucket.name)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '-' + Date.now() + '.jpg')
  }
});

const upload = multer({ storage })

// **************** CREATE Blob **************** //
app.post("/", upload.single("blob"), async (req: Request, res: Response) => {
  try {
    const { filename, path, size } = req.file
    const blob = new Blob();

    res.status(201).json({
      data: `Blob ${blob.name} has been successfully created`,
      meta: { status: 201 }
    });
  } catch (err) {
    res.status(400).json({ err });
  }

});

// **************** DELETE Blob **************** //
app.post('/:id', async(req: Request, res: Response) => {

});

export default app;
