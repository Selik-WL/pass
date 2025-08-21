import generatePassword from "../services/generator.js";
import ValidationError from "../services/ValidationError.js";
import Documentation from "../services/Documentation.js";

export default class ServiceController {
    static generate(request, response) {
        if (ValidationError.debug()) 
            console.log("Route mot de passe commencée.");
        
        const length = request.params.longueur;

        generatePassword(length)
        .then(password => {
            if (ValidationError.debug()) 
                console.log("promesse generatePassword tenue.");
        
            return response.status(200).json({
                "type":"password",
                "password":password
            });
        })
        .catch(error => ValidationError.exit(response, error));

        if (ValidationError.debug()) 
            console.log("Route mot de passe terminée.");
    }

    static typesDocumentation(request, response) {
        if (ValidationError.debug()) 
            console.log("Route documentation types commencée.");
        
        Promise.resolve()
        .then(() =>
            response.status(200).json({
                "type":"multiple",
                "mutiple":Documentation.getTypeDoc()
            })
        )
        .catch(error => ValidationError.exit(response, error))
        .finally(() => {
            if (ValidationError.debug()) 
                console.log("Route documentation types terminée.");
        });
    }

    static Documentation(request, response) {
        if (ValidationError.debug()) 
            console.log("Route documentation routes commencée.");
        
        Promise.resolve()
        .then(() => Documentation.getTypeDoc())
        .then(typeDocs => {
            if (ValidationError.debug()) 
                console.log("promesse getTypeDoc tenue.");

            const errorDocs = Documentation.getErrorDoc();
            return {typeDocs, errorDocs};
        })
        .then(({typeDocs, errorDocs}) => {
            if (ValidationError.debug()) 
                console.log("promesse getErrorDoc tenue.");

            let level = 1;
            if (request.currentUser === null) {
                level = 0;
            } else if (request.currentUser.admin)
                level = 2;
            
            const routeDocs = Documentation.getRouteDoc(level);

            return [...typeDocs, ...errorDocs, ...routeDocs];
        })
        .then((data) =>{
            if (ValidationError.debug()) 
                console.log("promesse getRouteDoc tenue.");
        
            response.status(200).json({
                "type":"multiple",
                "multiple":data
            })
        })
        .catch(error => ValidationError.exit(response, error))
        .finally(() => {
            if (ValidationError.debug()) 
                console.log("Route documentation routes terminée.");
        });
    }
};