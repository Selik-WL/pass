import Settings from '../services/Settings.js';

export default function processPaquet (paquet, response = {}) {

const error = (message) => {
    return {
        'type':'error',
        'error':{
            'target':'server',
            'message':message
        }
    };
};

/*
 *  {
 *      type: string
 *      ${type}: mixed
 *  }
*/
console.log(paquet);
console.log(typeof paquet === "object");
console.log(paquet !== null);
console.log('type' in paquet);
console.log(typeof paquet.type === 'string');
console.log(`${paquet.type}` in paquet);
console.log(paquet[paquet.type] !== null);
if (!(
    (typeof paquet === "object" && paquet !== null) &&
    ('type' in paquet && typeof paquet.type === 'string') &&
    (`${paquet.type}` in paquet && paquet[paquet.type] !== null)
))
    paquet = error("Réponse JSON invalide depuis l'API.");

const { type } = paquet;
const formatError = () => processPaquet(error(`Format de paquet ${type} non-respecté.`), response);

let content = paquet[type];
if (!["confirmation", "credentials", "error", "multiple", "password", "user", "typeDoc", "routeDoc", "errorDoc"].includes(type))
    content = error(`Paquet de type inconnu; ${type}.`).error;


if (Settings.debug()) {
    console.groupCollapsed(`processing type: ${type}`);
    console.log(JSON.stringify(content, null, 4));
    console.groupEnd();
}

switch (type) {
    case "confirmation":
                
        /*
         *  confirmation: string
        */
        if (!(
            typeof content === 'string'
        )) {
            formatError();
            break;
        }

        response.confirmation ??= []; 
        response.confirmation.push(content);
        break;

    case "credentials":

        /*
         *  credentials: { 
         *      userId: string|null, 
         *      userAdmin: boolean|null, 
         *      token: string|null
         *  }
        */
        if (!(
            typeof content === 'object' && content !== null && (
                ('userId' in content && (typeof content.userId === 'string' || content.userId === null)) &&
                ('userAdmin' in content && (typeof content.userAdmin === 'boolean' || content.userAdmin === null)) &&
                ('token' in content && (typeof content.token === 'string' || content.token === null))
            )
        )) {
            formatError();
            break;
        }

        response.credentials = content;
        break;

    case "error":

        /*
         *  error: {
         *      target: string, 
         *      message: string
         *  }
        */
        if (!(
            typeof content === 'object' && content !== null && (
                ('target' in content && typeof content.target === 'string') &&
                ('message' in content && typeof content.message === 'string')
            )
        )) {
            formatError();
            break;
        }

        response.error ??= []; 
        response.error.push(content);
        break;

    case "multiple":

        /*
         *  multiple: [
         *      paquet, ... 
         *  ]
        */
        if (!(
            Array.isArray(content)
        )) {
            formatError();
            break;
        }

        content.forEach(innerPaquet => processPaquet(innerPaquet, response));
        break;

    case "password":

        /*
         *  password: string
        */
        if (!(
            typeof content === 'string'
        )) {
            formatError();
            break;
        }

        response.password = content;
        break;

    case "user":
        /*
         *  user: { 
         *      userId: string, 
         *      userHandle: string, 
         *      userEmail: string, 
         *      userAdmin: boolean 
         *  }
        */
        if (!(
            typeof content === 'object' && content !== null && (
                ('userId' in content && typeof content.userId === 'string') &&
                ('userHandle' in content && typeof content.userHandle === 'string') &&
                ('userEmail' in content && typeof content.userEmail === 'string') &&
                ('userAdmin' in content && typeof content.userAdmin === 'boolean')
            )
        )) {
            formatError();
            break;
        }

        response.user ??= []; 
        response.user.push(content);
        break;

    case "typeDoc":

        /*
         *  typeDoc: { 
         *      type: string, 
         *      format: string, 
         *      description: string 
         *  }
        */
        if (!(
            typeof content === 'object' && content !== null && (
                ('type' in content && typeof content.type === 'string') &&
                ('format' in content && typeof content.format === 'string') &&
                ('description' in content && typeof content.description === 'string')
            )
        )) {
            formatError();
            break;
        }

        response.doc ??= []; 
        response.doc.push({type,content});
        break;

    case "routeDoc":

        /*
         *  routeDoc: { 
         *      id: string, 
         *      description: string, 
         *      accessLevel: string, 
         *      httpType: string, 
         *      route: string, 
         *      inputComponents: [ 
         *          string, ... 
         *      ], 
         *      outputTypes: [ 
         *          string, ... 
         *      ], 
         *      examples: [ 
         *          { 
         *              curl: string, 
         *              result: string, 
         *              comment: string 
         *          }, ... 
         *      ] 
         *  }
        */
        if (!(
            typeof content === 'object' && content !== null && (
                ('id' in content && typeof content.id === 'string') &&
                ('description' in content && typeof content.description === 'string') &&
                ('accessLevel' in content && typeof content.accessLevel === 'string') &&
                ('httpType' in content && typeof content.httpType === 'string') &&
                ('route' in content && typeof content.route === 'string') &&
                ('inputComponents' in content && Array.isArray(content.inputComponents) && content.inputComponents.every(inputComponent => typeof inputComponent === 'string')) &&
                ('outputTypes' in content && Array.isArray(content.outputTypes) && content.outputTypes.every(outputType => typeof outputType === 'string')) &&
                ('examples' in content && Array.isArray(content.examples) && content.examples.every(example => 
                    typeof example === 'object' && example !== null && (
                        ('curl' in example && typeof example.curl === 'string') &&
                        ('result' in example && typeof example.result === 'string') &&
                        ('comment' in example && typeof example.comment === 'string')
                    )
                ))
            )
        )) {
            formatError();
            break;
        }

        response.doc ??= []; 
        response.doc.push({type,content});
        break;

    case "errorDoc":

        /*
         *  errorDoc: { 
         *      target: string, 
         *      description: string 
         * }
        */
        if (!(
            typeof content === 'object' && content !== null && (
                ('target' in content && typeof content.target === 'string') &&
                ('description' in content && typeof content.description === 'string')
            )
        )) {
            formatError();
            break;
        }

        response.doc ??= []; 
        response.doc.push({type,content});
        break;
    }

    return response;
}