import { Router } from "express";
import user from "./user";

const api = Router();

api.use("/users", user);

export default api;


// list of HTTP status codes

// 200 : OK
// Standard response for successful HTTP requests. The actual response will depend on the request method subscribersDir

// 201 : Created
// The request has been fulfilled, resulting in the creation of a new resource

// 202 : Accepted
// The request has been accepted for processing, but the processing has not been completed

// 204 : No Content
// The server successfully processed the request and is not returning any content
