import { Router } from "express";
import user from "./user";
import bucket from './bucket'
import blob from './blob'

const api = Router();

api.use("/users", user);
api.use("/buckets", bucket);
api.use("/blobs", blob);

export default api;
