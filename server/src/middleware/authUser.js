import ValidationError from '../services/ValidationError.js';

export default function authUser(request, response, next){
    Promise.resolve()
    .then(() => {
        if (!request.currentUser)
            throw new ValidationError("Accès refusé : authentification de l'utilisateur requise.", 401, 'login');
        if (request.error !== null)
            throw request.error;
        next();
    })
    .catch(error => ValidationError.exit(response,error));
};