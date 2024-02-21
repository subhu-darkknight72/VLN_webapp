import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router/index.routes';

import {
    MONGO_URL,
    PORT
} from './config';


const app = express();
app.use(cors());
app.use(express.json());

app.use('/', router);

app.listen(PORT, () => {
    try {
        console.log(`Server is running on port ${PORT}`);
        mongoose.connect(MONGO_URL);
        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB');
        });
        mongoose.connection.on('error', (err) => {
            console.log('Error connecting to MongoDB', err);
        });
    }
    catch (err) {
        console.log(err);
    }
});
