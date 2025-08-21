import ValidationError from '../services/ValidationError.js';

export default function authOwnOrAdmin(request, response, next) {
    try {
        if (!request.currentUser.admin && String(request.currentUser._id) !== String(request.params.id)) 
            throw new ValidationError("Accès refusé : réservé aux administrateurs ou au propriétaire du profil.", 403, 'login');
        next();
    } catch (error) {
        ValidationError.exit(response,error);
    }
};