import express from 'express';

import UserController from '../controllers/UserController.js';
import ServiceController from '../controllers/ServiceController.js';
import sessionLogin from '../middleware/sessionLogin.js';
import authUser from '../middleware/authUser.js';
import authAdmin from '../middleware/authAdmin.js';
import authOwnOrAdmin from '../middleware/authOwnOrAdmin.js';
import ValidationError from '../services/ValidationError.js';

export default class Router {
    static userRoutes() {
        if (ValidationError.debug()) 
            console.log("Routes d'utilisateur initialisées.");
        const router = express.Router();

        // route 1: sign up, public access
        router.post('/', sessionLogin, UserController.signup);
        // route 7*: log in, public access
        router.post('/login', sessionLogin, UserController.login);


        // route 4: read one profile, user self access, admin acess
        router.get('/:id', sessionLogin, authUser, authOwnOrAdmin, UserController.readOne);
        // route 5: modify one profile, user self access, admin access
        router.put('/:id', sessionLogin, authUser, authOwnOrAdmin, UserController.editOne);

        // route 2: delete profile, admin access
        router.delete('/:id', sessionLogin, authUser, authAdmin, UserController.deleteOne);
        // route 3: read all profiles, admin access
        router.get('/', sessionLogin, authUser, authAdmin, UserController.readAll);

        return router;
    }

    static serviceRoutes() {
        if (ValidationError.debug()) 
            console.log("Routes de services initialisées.");
        const router = express.Router();
    
        // route 6*: generate random password, public access
        router.get('/motdepasse/:longueur', ServiceController.generate);

        // route 8*: get api documentation, tiered public access
        router.get('/doc', sessionLogin, ServiceController.Documentation);

        return router;
    }
}




