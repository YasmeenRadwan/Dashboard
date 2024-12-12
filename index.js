import express from 'express';
import {connectionDB} from './DB/connection.js';
import { globalResponse } from './SRC/Middleware/error-handle.middleware.js';
import { config } from 'dotenv';
import * as router from './SRC/Modules/index.js';
import cors from 'cors'; 


const app = express();

config()

let port = process.env.PORT;
app.use(cors());
app.use(express.json())

app.use('/about',router.aboutRouter);
app.use('/service',router.serviceRouter);
app.use('/category',router.categoryRouter);
app.use('/offer',router.offerRouter);

app.use(globalResponse);

connectionDB()

console.log("port" , process.env.CONNECTION_DB_URI);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

