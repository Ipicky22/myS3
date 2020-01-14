import fs from 'fs';
import 'reflect-metadata';
import { createConnection } from "typeorm";

require('dotenv').config();
const config = fs.existsSync(__dirname.replace('\\', '/') + '/ormconfig.js') ? require('./ormconfig.js') : null;

export const initializeConnectionBdd = () => {
    createConnection()
        .then(async connection => {
            console.log("The connection to the database is a success");
        })
        .catch(error => {
            console.log(error);
        });
};
