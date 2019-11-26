import app from './app';
import "./routes/middleware/passport";
import { initializeConnectionBdd } from './database/initdb';

require('dotenv').config();
const port: String | undefined = process.env.SERVER_PORT;

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
    initializeConnectionBdd();
});
