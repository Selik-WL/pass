import dotenv from 'dotenv';

import UserServices from '../services/UserServices.js';
import ValidationError from '../services/ValidationError.js';

dotenv.config();

export default class UserController {
    static signup(request, response) {
        if (ValidationError.debug()) 
            console.log("Route nouveau utilisateur commencée.");
        
        const {handle, email, password, admin} = request.body;

        //abort if logged in
        if (request.currentUser !== null) {
            if (ValidationError.debug()) 
                console.log("Route nouveau utilisateur terminée.");

            return response.status(400).json({
                "type":"error",
                "error":{
                    "target":"login",
                    "message":"Vous êtes déjà connecté. Veuillez vous déconnecter pour créer un nouveau compte."
                }
            });
        }

        UserServices.validateAll(handle, email, password, admin)
        .then(() => {
            if (ValidationError.debug()) 
                console.log("promesse validateAll tenue.");
        
            return UserServices.hashPassword(password);
        })
        .then(hash => {
            if (ValidationError.debug()) 
                console.log("promesse hashPassword tenue.");

            return UserServices.addUser(handle, email, hash, admin);
        })
        .then(savedUser => {
            if (ValidationError.debug()) 
                console.log("promesse addUser tenue.");
            
            return UserServices.createToken(savedUser._id)
                .then(token => ({ savedUser, token }));
        })
        .then(({savedUser, token}) => {
            if (ValidationError.debug()) 
                console.log("promesse createToken tenue.");
        
            return UserServices.getCredentials(savedUser._id, savedUser.admin, token)
                .then(credentials => ({credentials,savedUser}));
        })
        .then(({credentials,savedUser}) => {
            if (ValidationError.debug()) 
                console.log("promesse getCredentials tenue.");
        
            response.status(201).json({
                "type":"multiple", 
                "multiple":[
                    {
                        "type":"confirmation", 
                        "confirmation":("Bienvenue " + savedUser.handle)
                    },
                    credentials
                ]
            });
        })
        .catch(error => ValidationError.exit(response, error))
        .finally(() => {
            if (ValidationError.debug()) 
                console.log("Route nouveau utilisateur terminée.");
        });
    };

    static login(request, response) {
        if (ValidationError.debug()) 
            console.log("Route utilisateur commencée.");

        const {principal, credential} = request.body;

        //abort if logged in
        if (request.currentUser !== null) {
            if (ValidationError.debug()) 
                console.log("Route utilisateur terminé.");

            return response.status(200).json({
                "type":"confirmation",
                "confirmation":"Vous êtes déjà connecté."
            });
        }

        UserServices.getExistingUserByPrincipal(principal)
        .then(user => {
            if (ValidationError.debug()) 
                console.log("promesse existingUserByPrincipal tenue.");
        
            return UserServices.verifyPassword(credential, user.password)
                .then(() => user);
        })
        .then(user => {
            if (ValidationError.debug()) 
                console.log("promesse verifyPassword tenue.");
        
            return UserServices.createToken(user._id)
            .then(token => ({user, token}));
        })
        .then(({user, token}) => {
            if (ValidationError.debug()) 
                console.log("promesse createToken tenue.");
        
            return UserServices.getCredentials(user._id, user.admin, token);
        })
        .then(credentials => {
            if (ValidationError.debug()) 
                console.log("promesse getCredentials tenue.");
        
            response.status(200).json(credentials);
        })
        .catch(error => {
            if (error instanceof ValidationError && (error.target === 'principal' || error.target === 'credential' )) {// Mask actual issue if client input issue.
                    ValidationError.exit(response, ValidationError.mask(error, new ValidationError('Échec de connexion : identifiant ou mot de passe incorrect.', 400, 'login')));
            } else {
                ValidationError.exit(response, error);
            }
        })
        .finally(() => {
            if (ValidationError.debug()) 
                console.log("Route utilisateur terminé.");
        });
    };

    static readAll(request, response) {
        if (ValidationError.debug()) 
            console.log("Route lire tout commencée.");

        UserServices.getAllUsers()
        .then(users => {
            if (ValidationError.debug()) 
                console.log("promesse getAllUsers tenue.");
        
            const promisses = users.map(user => UserServices.exportUser(user));
            return Promise.all(promisses);
        })
        .then(userDocs => {
            if (ValidationError.debug()) 
                console.log("promesses exportUser toutes tenue.");
        
            return response.status(200).json({
                "type":"multiple",
                "multiple":userDocs
            });
        })
        .catch(error => ValidationError.exit(response,error))
        .finally(() => {
            if (ValidationError.debug()) 
                console.log("Route lire tout terminée.");
        });
    };

    static readOne(request, response) {
        if (ValidationError.debug()) 
            console.log("Route lire un commencée.");
    
        const {id} = request.params;

        UserServices.getExistingUserByID(id)
        .then(user => {
            if (ValidationError.debug()) 
                console.log("promesse getExistingUserByID tenue.");
        
            return UserServices.exportUser(user);
        })
        .then(userDoc => {
            if (ValidationError.debug()) 
                console.log("promesse exportUser tenue.");
        
            return response.status(200).json(userDoc);
        })
        .catch(error => ValidationError.exit(response,error))
        .finally(() => {
            if (ValidationError.debug()) 
                console.log("Route lire un terminée.");
        });
    };


    static editOne(request, response) {
        if (ValidationError.debug()) 
            console.log("Route modifier un commencée.");
    
        const {id} = request.params;
        const {handle, email, password, admin} = request.body;

        UserServices.getExistingUserByID(id)
        .then(user => {
            if (ValidationError.debug()) 
                console.log("promesse getExistingUserByID tenue.");
        
            return UserServices.validateAll(handle, email, password, admin, user.handle, user.email)
                .then(() => user);
            })
        .then((user) => {
            if (ValidationError.debug()) 
                console.log("promesse validateAll tenue.");
        
            return UserServices.hashPassword(password)
                .then(hash => ({user,hash}));
            })
        .then(({user,hash}) => {
            if (ValidationError.debug()) 
                console.log("promesse hashPassword tenue.");
        
            return UserServices.editUser(user, handle, email, hash, admin)
                .then(() => user);
            })
        .then(savedUser => {
            if (ValidationError.debug()) 
                console.log("promesse editUser tenue.");
        
            if (String(savedUser._id) === String(request.currentUser._id)) 
                return UserServices.getCredentials(savedUser._id, savedUser.admin, request.currentUserToken);
            return null;
        })
        .then(credentials  => {
            if (ValidationError.debug()) 
                console.log("promesse getCredentials? tenue.");
        
            //if user modifying self, need to send new credentials as well as message, otherwise just message
            if (credentials === null) {
                response.status(200).json({"type":"confirmation", "confirmation":"Utilisateur modifié."});
            } else {
                response.status(200).json({
                    "type":"multiple", 
                    "multiple":[
                        {
                            "type":"confirmation", 
                            "confirmation":"Utilisateur modifié."
                        },
                        credentials
                    ]
                });
            }
        })
        .catch(error => ValidationError.exit(response,error))
        .finally(() => {
            if (ValidationError.debug()) 
                console.log("Route modifier un terminée.");
        });
    };


    static deleteOne(request, response) {
        if (ValidationError.debug()) 
            console.log("Route effacer un commencée.");
    
        const {id} = request.params;

        UserServices.getExistingUserByID(id)
        .then(user => {
            if (ValidationError.debug()) 
                console.log("promesse getExistingUserByID tenue.");
        
            return UserServices.deleteUser(user)
                .then(() => user);
        })
        .then(user => {
            if (ValidationError.debug()) 
                console.log("promesse deleteUser tenue.");

            //if user deleting self, need to send empty credentials as well as message, otherwise just message
            if (String(user._id) !== String(request.currentUser._id)) {
                response.status(200).json({
                    "type":"confirmation", 
                    "confirmation":"Utilisateur effacé."
                });
            } else {
                response.status(200).json({
                    "type":"multiple", 
                    "multiple":[
                        {
                            "type":"confirmation", 
                            "confirmation":"Utilisateur effacé."
                        },
                        {
                            "type":"credentials",
                            "credentials":{
                                "userId":null,
                                "userAdmin":null,
                                "token":null
                            }
                        }
                    ]
                })
            }
        })
        .catch(error => ValidationError.exit(response,error))
        .finally(() => {
            if (ValidationError.debug()) 
                console.log("Route effacer un terminée.");
        });
    };
}