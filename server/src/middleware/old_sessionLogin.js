import userServices from '../services/UserServices.js';
import ValidationError from '../services/ValidationError.js';

export default function sessionLogin(request, response, next){
    const authHeader = request.headers.authorization;
    Promise.resolve()
    .then(() => {
        if (!authHeader || !authHeader.startsWith('Bearer ')) 
            throw new ValidationError("Accès refusé : en-tête d'autorisation invalide ou manquant.", 401, 'login');
        return authHeader.split(' ')[1];
    })
    .then(token => {
        if (ValidationError.debug()) 
            console.log("promesse getAuthorizationToken tenue.");

        request.currentUserToken = token;
                
        return userServices.getTokenUserId(token);
    })
    .then(userId => {
        if (ValidationError.debug()) 
            console.log("promesse getTokenUserId tenue.");

        if (userId === null)
            return null;
        return userServices.getExistingUserByID(userId);
    })
    .then(user => {
        request.currentUser = user;
        request.error = null;
        next();
    })
    .catch(error => {
        request.currentUser = null;
        request.error = error;
        next();
    });
};