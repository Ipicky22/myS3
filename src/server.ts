import app from './app';
import "./routes/middleware/passport";
import { initializeConnectionBdd } from './database/initdb';
var fs = require('fs');
require('dotenv').config();
const port: String | undefined = process.env.SERVER_PORT;

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);

    const dir = process.env.STORAGE

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log("The storage folder has been successfully created.");
    } else if (fs.existsSync(dir)) {
        console.log("The storage folder already exists.");
    } else {
        console.log("The folder " + process.env.STORAGE + " could not be created.");
    }

    initializeConnectionBdd();
});
