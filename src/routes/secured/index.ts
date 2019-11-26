import { Router } from "express";
import user from "./user";

const api = Router();

api.use("/users", user);

export default api;
