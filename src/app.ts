import express from 'express';
import bodyParser from 'body-parser';
import MainController from "./controllers/MainController";
import {connectToDatabase} from "./services/database.service"

const app = express();
const port = 3210;

app.use(bodyParser.urlencoded({
    extended: true
}));

connectToDatabase()
    .then(() => {
        app.use('/', (new MainController).router);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });
