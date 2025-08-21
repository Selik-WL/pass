export default class Documentation {
    static getTypeDoc() {
        return [
            {
                "type":"typeDoc",
                "typeDoc":{
                    "type":"confirmation",
                    "format":"confirmation: string",
                    "description":"Un message de confirmation."
                }
            }, 
            {
                "type":"typeDoc",
                "typeDoc":{
                    "type":"credentials",
                    "format":"credentials: { \n\tuserId: string|null, \n\tuserAdmin: boolean|null, \n\ttoken: string|null \n}",
                    "description":"Les données d'authentification. (qui, permission, preuve)"
                }
            }, 
            {
                "type":"typeDoc",
                "typeDoc":{
                    "type":"error",
                    "format":"error: { \n\ttarget: string, \n\tmessage: string \n}",
                    "description":"Un message d'erreur ainsi que sa source."
                }
            }, 
            {
                "type":"typeDoc",
                "typeDoc":{
                    "type":"multiple",
                    "format":"multiple:[ \n\tpaquet, ... \n]",
                    "description":"Une liste de paquets de données."
                }
            }, 
            {
                "type":"typeDoc",
                "typeDoc":{
                    "type":"password",
                    "format":"password: string",
                    "description":"Un mot de passe."
                }
            }, 
            {
                "type":"typeDoc",
                "typeDoc":{
                    "type":"user",
                    "format":"user: { \n\tuserId: string, \n\tuserHandle: string, \n\tuserEmail: string, \n\tuserAdmin: boolean \n}",
                    "description":"Les données d'un profil d'utilisateur."
                }
            }, 
            {
                "type":"typeDoc",
                "typeDoc":{
                    "type":"typeDoc",
                    "format":"typeDoc: { \n\ttype: string, \n\tformat: string, \n\tdescription: string \n}",
                    "description":"Le format de description des différents types de paquets de données."
                }
            }, 
            {
                "type":"typeDoc",
                "typeDoc":{
                    "type":"routeDoc",
                    "format":"routeDoc: { \n\tid: string, \n\tdescription: string, \n\taccessLevel: string, \n\thttpType: string, \n\troute: string, \n\tinputComponents: [ \n\t\tstring, ... \n\t], \n\toutputTypes: [ \n\t\tstring, ... \n\t], \n\texamples: [ \n\t\t{ \n\t\t\tcurl: string, \n\t\t\tresult: string, \n\t\t\tcomment: string \n\t\t}, ... \n\t] \n}",
                    "description":"Le format de description des différentes routes. Il inclut l'identifiant de la route (* pour les routes secondaires), sa description, le niveau de permission requis pour y accéder, la méthode HTTP, le chemin d'accès, les données à transmettre (les : indiquent des paramètres allant dans la route), les types de paquets de données pouvant être retournés, ainsi qu'une liste d'exemples, chacun comprenant une commande curl, le résultat attendu et un commentaire."
                }
            },
            {
                "type":"typeDoc",
                "typeDoc":{
                    "type":"errorDoc",
                    "format":"errorDoc: { \n\ttarget: string, \n\tdescription: string \n}",
                    "description":"Le format de description des différentes sources d'erreurs."
                }
            }
        ];
    }

    static getErrorDoc() {
        return [
            {
                "type":"errorDoc",
                "errorDoc":{
                    "target":"password",
                    "description":"Une erreur avec la valeur de mot de passe passée."
                }
            },
            {
                "type":"errorDoc",
                "errorDoc":{
                    "target":"handle",
                    "description":"Une erreur avec la valeur de pseudonyme passée."
                }
            },
            {
                "type":"errorDoc",
                "errorDoc":{
                    "target":"email",
                    "description":"Une erreur avec la valeur d'email passée."
                }
            },
            {
                "type":"errorDoc",
                "errorDoc":{
                    "target":"admin",
                    "description":"Une erreur avec la valeur de type d'utilisateur passée."
                }
            },
            {
                "type":"errorDoc",
                "errorDoc":{
                    "target":"identifier",
                    "description":"Une erreur avec la valeur d'identifiant passée."
                }
            },
            {
                "type":"errorDoc",
                "errorDoc":{
                    "target":"length",
                    "description":"Une erreur avec la valeur de longeur de mot de passe passée."
                }
            },
            {
                "type":"errorDoc",
                "errorDoc":{
                    "target":"principal",
                    "description":"Une erreur avec la valeur principale (pseudonyme ou email) de connexion passée."
                }
            },
            {
                "type":"errorDoc",
                "errorDoc":{
                    "target":"credential",
                    "description":"Une erreur avec la donnée d'authentification (mot de passe) de connexion passée."
                }
            },
            {
                "type":"errorDoc",
                "errorDoc":{
                    "target":"login",
                    "description":"Une erreur lors de la connexion."
                }
            },
            {
                "type":"errorDoc",
                "errorDoc":{
                    "target":"server",
                    "description":"Une erreur avec un service ou un API dans le serveur."
                }
            },
            {
                "type":"errorDoc",
                "errorDoc":{
                    "target":"unknown",
                    "description":"Une erreur non-anticipée ou non-capturée."
                }
            }
        ];
    }

    static getRouteDoc(level) {
    let routeDocs = [
        {
            "type":"routeDoc",
            "routeDoc":{
                "id":"1",
                "description":"Permet de s'enregistrer, retournant un message d'accueil et les données d'authentification.",
                "accessLevel":"public",
                "httpType":"POST",
                "route":"/profils",
                "inputComponents":[
                    "handle",
                    "email",
                    "password",
                    "admin"
                ],
                "outputTypes":[
                    "error",
                    "multiple[ confirmation, credentials ]"
                ],
                "examples":[]
            }
        },
        {
            "type":"routeDoc",
            "routeDoc":{
                "id":"6*",
                "description":"Permet de générer un mot de passe aléatoirement de la longueur voulue.",
                "accessLevel":"public",
                "httpType":"GET",
                "route":"/motdepasse/:longueur",
                "inputComponents":[
                    ":longueur"
                ],
                "outputTypes":[
                    "error",
                    "password"
                ],
                "examples":[]
            }
        },
        {
            "type":"routeDoc",
            "routeDoc":{
                "id":"7*",
                "description":"Permet de se connecter, retournant les données d'authentification.",
                "accessLevel":"public",
                "httpType":"POST",
                "route":"/profils/login",
                "inputComponents":[
                    "principal",
                    "credential"
                ],
                "outputTypes":[
                    "error",
                    "credentials",
                    "confirmation"
                ],
                "examples":[]
            }
        },
        {
            "type":"routeDoc",
            "routeDoc":{
                "id":"8*",
                "description":"Permet d'obtenir la documentation sur l'API.",
                "accessLevel":"public(tiered)",
                "httpType":"GET",
                "route":"/doc",
                "inputComponents":[],
                "outputTypes":[
                    "error",
                    "multiple[ typeDoc, ... , errorDoc, ... , routeDoc, ... ]"
                ],
                "examples":[]
            }
        }
    ];

    //add user level routes
    if (level > 0) 
        routeDocs.push(
            {
                "type":"routeDoc",
                "routeDoc":{
                    "id":"4",
                    "description":"Permet d'obtenir les données d'un profil.",
                    "accessLevel":"soi/admin",
                    "httpType":"GET",
                    "route":"/profils/:id",
                    "inputComponents":[
                        ":id"
                    ],
                    "outputTypes":[
                        "error",
                        "user"
                    ],
                    "examples":[]
                }
            },
            {
                "type":"routeDoc",
                "routeDoc":{
                    "id":"5",
                    "description":"Permet de modifier les données d'un profil, retournant un message de confirmation et, si modifiant son propre profil, les nouvelles données d'authentification.",
                    "accessLevel":"soi/admin",
                    "httpType":"PUT",
                    "route":"/profils/:id",
                    "inputComponents":[
                        ":id",
                        "handle",
                        "email",
                        "password",
                        "admin"
                    ],
                    "outputTypes":[
                        "error",
                        "confirmation",
                        "multiple[ confirmation, credentials ]"
                    ],
                    "examples":[]
                }
            });
    
    //add admin level routes
    if (level > 1) 
        routeDocs.push(
            {
                "type":"routeDoc",
                "routeDoc":{
                    "id":"2",
                    "description":"Permet d'effacer un profil, retournant un message de confirmation.",
                    "accessLevel":"admin",
                    "httpType":"DELETE",
                    "route":"/profils/:id",
                    "inputComponents":[
                        ":id"
                    ],
                    "outputTypes":[
                        "error",
                        "confirmation",
                        "multiple[ confirmation, credentials ]"
                    ],
                    "examples":[]
                }
            },
            {
                "type":"routeDoc",
                "routeDoc":{
                    "id":"3",
                    "description":"Permet d'obtenir les données de tous les profils.",
                    "accessLevel":"admin",
                    "httpType":"GET",
                    "route":"/profils",
                    "inputComponents":[],
                    "outputTypes":[
                        "error",
                        "multiple[ user, ... ]"
                    ],
                    "examples":[]
                }
            });

    return routeDocs;
    }
}