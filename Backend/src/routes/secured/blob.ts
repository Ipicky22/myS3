import { Router, Request, Response } from "express";
import { getRepository } from 'typeorm';
import { Blob } from "../../database/entity/Blob";
import jwt from "jsonwebtoken";

const app = Router();
const secret = process.env.SUPERSECRET as string;

// GET user by uuid
app.get('/:uuid', async (req: Request, res: Response) => {

});

// PATCH update user
app.patch('/:uuid', async (req: Request, res: Response) => {

});

// DELETE user by uuid
app.delete('/:uuid', async (req: Request, res: Response) => {

});

// GET All users
app.get('/', async (req: Request, res: Response) => {

});

// DELETE all users
app.delete('/', async (req: Request, res: Response) => {

});

export default app;
