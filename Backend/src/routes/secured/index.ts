import { Router } from "express";
import passport from 'passport';
import user from "./user";
import blob from "./blob";
import bucket from "./bucket";

const api = Router();

api.use("/users", user);
api.use("/users/:uuid/buckets", passport.authenticate("jwt", { session : false }), bucket);
api.use("/users/:uuid/buckets/:bucket_id/blobs",passport.authenticate("jwt", { session: false }), blob);

export default api;
