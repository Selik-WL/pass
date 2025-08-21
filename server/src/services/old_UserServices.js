import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import ValidationError from "../services/ValidationError.js";
import User from "../models/User.js"

dotenv.config();
export default class UserServices {

    /*
     * Database interface functions.
    */

    static getExistingUserByID(identifier) {
        return Promise.resolve()
        .then(() => {
            if (!identifier || typeof identifier !== 'string' || !mongoose.Types.ObjectId.isValid(identifier)) 
                throw new ValidationError('Identifiant de profils invalide.', 400, 'identifier');
            return User.findOne({ _id: identifier }).exec();
        })
        .then(user => {
            if (!user) 
                throw new ValidationError("Profils d'utilisateur non-trouvé.", 404, 'identifier');
            return user;
        })
        .catch(error => {throw ValidationError.wrap(error, 
            new ValidationError('Échec de chargement du profils utilisateur.', 500, 'server'));
        });
    }   

    static getExistingUserByPrincipal(principal) {
        return Promise.resolve()
        .then(() => {
            if (!principal || typeof principal !== 'string') 
                throw new ValidationError('Principal de profils invalide.', 400, 'principal');
            return User.findOne({ $or:[{handle: principal}, {email: principal}] });
        })
        .then(user => {
            if (!user) 
                throw new ValidationError("Profils d'utilisateur non-trouvé.", 404, 'principal');
            return user;
        })
        .catch(error => {throw ValidationError.wrap(error, 
            new ValidationError('Échec de chargement du profils utilisateur.', 500, 'server'));
        });
    }

    static getAllUsers() {
        return User.find({})
        .catch(error => {throw ValidationError.wrap(error, 
            new ValidationError('Échec de chargement des profils utilisateurs.', 500, 'server'));
        });
    }

    static exportUser(user) {
        return Promise.resolve()
        .then(() => {
            return {
                "type":"user",
                "user":{
                    "userId":user._id,
                    "userHandle":user.handle,
                    "userEmail":user.email,
                    "userAdmin":user.admin
                }
            };
        });
    }

    static addUser(handle, email, password, admin) {
        return Promise.resolve()
        .then(() => new User({handle, email, password, admin}).save())
        .catch(error => {throw ValidationError.wrap(error, 
            new ValidationError("Échec d'enregistrement du nouveau utilisateur.", 500, 'server'));
        });
    }

    static editUser(user, handle, email, password, admin) {
        return Promise.resolve()
        .then(() => {
            Object.assign(user, {handle, email, password, admin});
            return user.save();
        })
        .catch(error => {throw ValidationError.wrap(error, 
            new ValidationError("Échec d'enregistrement des nouvelles valeurs d'utilisateur.", 500, 'server'));
        });
    }

    static deleteUser(user) {
        return Promise.resolve()
        .then(() => user.deleteOne())
        .catch(error => {throw ValidationError.wrap(error, 
            new ValidationError("Échec d'effacement de l'utilisateur.", 500, 'server'));
        });
    }


    /*
     * Token credential functions.
    */
    static createToken(userId) {
        return Promise.resolve()
        .then(() => jwt.sign({userId}, process.env.JWT_KEY, { expiresIn: '24h' }))
        .catch(error => {throw ValidationError.wrap(error, 
            new ValidationError("Échec d'encodage de la certification.", 500 , 'server'))
        });
    }

    static getTokenUserId(token) {
        if (token === 'null')
            return Promise.resolve(null);
        return Promise.resolve()
        .then(() => jwt.verify(token, process.env.JWT_KEY))
        .then(decoded => decoded.userId)
        .catch(error => {
            let message;
            switch (error.name)
            {
                case 'TokenExpiredError':
                    message = 'Accès refusé: session expirée. Veuillez vous reconnecter.';
                    break;
                case 'NotBeforeError':
                    message = 'Accès refusé: Votre session n’est pas encore active. Veuillez réessayer dans un instant.';
                    break;
                case 'JsonWebTokenError':
                default:
                    message = "Accès refusé: Échec de l'authentication. Veuillez vous reconnecter";
            }
            throw new ValidationError(message, 401, 'login');
        })
    }

    static getCredentials(userId, userAdmin, token) {
        return Promise.resolve({
            "type":"credentials",
            "credentials":{
                userId,
                userAdmin,
                token
            }
        });
    }


    /*
     * Password encription functions.
    */

    static hashPassword(password) {
        return bcrypt.hash(password, 10)
        .catch(error => {throw ValidationError.wrap(error, 
            new ValidationError("Échec d'encryption du mot de passe.", 500, 'server'));
        });
    }

    static verifyPassword(password, hash) {
        return bcrypt.compare(password, hash)
        .then(match => {
            if (!match)
                throw new ValidationError("Mot de passe incorrect.", 400, 'credential');
        })
        .catch(error => {throw ValidationError.wrap(error,
            new ValidationError("Échec de décryption du mot de passe.", 500, 'server'));
        });
    }


    /*
     * Validation functions.
    */

    static validateAll(handle, email, password, admin, oldHandle = null, oldEmail = null) {
        return Promise.resolve()
        .then(() => {
            if (!password || typeof password !== 'string') 
                throw new ValidationError('Mot de passe de profils invalide.', 400, 'password');
            if (admin === undefined || typeof admin !== 'boolean') 
                throw new ValidationError('Niveau de permission de profils invalide.', 400, 'admin');
        })
        .then(() => {
            if (ValidationError.debug()) 
                console.log("promesse validatePasswordAndAdmin tenue.");
        
            return this.#validateHandle(handle, oldHandle);
        })
        .then(() => {
            if (ValidationError.debug()) 
                console.log("promesse validateHandle tenue.");
            return this.#validateEmail(email, oldEmail);
        })
        .then(() => {
            if (ValidationError.debug()) 
                console.log("promesse validateEmail tenue.");
            return this.#validateEmailWithAPI(email)
        })
        .then(() => {
            if (ValidationError.debug()) 
                console.log("promesse validateEmailWithAPI tenue.");
        })
        .catch(error => {throw ValidationError.wrap(error, 
            new ValidationError("Échec de la validation des valeurs entrées.", 500, 'server'));
        });
    }

    static #validateEmail(email, currentEmail) {
        return Promise.resolve()
        .then(() => {
            if (!email || typeof email !== 'string') 
                throw new ValidationError('Email de profils invalide.', 400, 'email');
            if (email != currentEmail)
                return this.getExistingUserByPrincipal(email);
        })
        .then(user => {
            if (user)
                throw new ValidationError('Email non-disponible.', 400, 'email');
        })
        .catch(error => {
            if (error instanceof ValidationError) {
                if (error.status === 404) 
                    return;
                throw error;
            }
            throw ValidationError.wrap(error, new ValidationError("Échec de la validation de l'email de l'utilisateur.", 500, 'email'));
        })
    }

    static #validateHandle(handle, currentHandle) {
        return Promise.resolve()
        .then(() => {
            if (!handle || typeof handle !== 'string') 
                throw new ValidationError('Nom de profils invalide.', 400, 'handle');
            if (handle != currentHandle)
                return this.getExistingUserByPrincipal(handle);
        })
        .then(user => {
            if (user)
                throw new ValidationError('Nom non-disponible.', 400, 'handle');
        })
        .catch(error => {
            if (error instanceof ValidationError) {
                if (error.status === 404) 
                    return;
                throw error;
            }
            throw ValidationError.wrap(error, new ValidationError("Échec de la validation du nom de l'utilisateur.", 500, 'handle'));
        })
    }

    static #validateEmailWithAPI(email) {
        //email verification with maileroo api
        return fetch(`https://api.zeruh.com/v1/verify?api_key=${process.env.ZERUH_KEY}&email_address=${email}`)
        .catch(error => {
            throw ValidationError.wrap(error, new ValidationError("Erreur réseau ou système inattendue.", 500, 'email'))
        })
        .then(response => {
            if (!response.ok) {
                throw new ValidationError("Échec de la validation par API de l'email de l'utilisateur.", 500, 'email');
            }
            return response.json()
            .catch(error => {
                throw ValidationError.wrap(error, new ValidationError("Réponse JSON invalide depuis l'API.", 500, 'email'));
            });
        })
        .then(data => {
            const validation = data?.result?.validation_details;
            if (!validation) 
                throw new ValidationError("Réponce d'API non conforme.", 500, 'email');
            // might add more checks in the fututre, will need to ask teacher.
            if (!validation.format_valid) {
                throw new ValidationError('Email invalide.', 400, 'email');
            }
            if (!validation.mx_found) {
                throw new ValidationError("Domaine d'email invalide.", 400, 'email');
            }
            if (!validation.smtp_check) {
                throw new ValidationError("Email n'est pas distribuable.", 400, 'email');
            }
            if (validation.disposable) {
                throw new ValidationError("Addresse d'email disposables interdites.", 400, 'email');
            }
        })
    };
}