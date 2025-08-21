import ValidationError from "../services/ValidationError.js";

export default function generatePassword(lengthInput) {
    return Promise.resolve()
    .then(() => {
        const length = parseInt(lengthInput, 10);

        if (isNaN(length) || length <= 0 || length > 512) {
            throw new ValidationError('Longeur de mot de passe incorrect. Doit être une valeur entre 1 et 512.',400,'length');
        }

        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            // Get a random number beteen 0 and n (length of charset).
            const pos = Math.floor(Math.random() * charset.length);
            // Get associated character.
            password += charset.charAt(pos);
        }

        return password;
    })
    .catch (error => {throw ValidationError.wrap(error, 
        new ValidationError('Échec de génération du mot de passe.',500,'server'));
    });
}