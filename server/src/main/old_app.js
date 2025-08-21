import express from 'express';
import cors from 'cors';

import connectDB from '../services/mongoose.js';
import Router from '../main/Router.js';
import ValidationError from '../services/ValidationError.js';

export default function app() {
    connectDB()

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use((error, request, response, next) => {
        throw ValidationError.wrap(error, new ValidationError("Mauvais packet json dans le corps de la requête.", 400, 'unknown'));
    });
    app.use('/profils', Router.userRoutes());
    app.use(Router.serviceRoutes());
    app.use((request, response) => {
        throw new ValidationError('Requête non-supportée.', 404, 'unknown');
    });
    app.use((error, request, response, next) => {
        ValidationError.exit(response, error);
    });

    if (ValidationError.debug()) 
        console.log("L'app à été créé.");
    return app;
}