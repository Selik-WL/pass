import ValidationError from '../services/ValidationError.js';

export default function authAdmin(request, response, next) {
    try {
        if (!request.currentUser.admin) 
            throw new ValidationError("Accès refusé : compte administrateur requis.", 403, 'login');
        next();
    } catch (error) {
        ValidationError.exit(response,error);
    }
};