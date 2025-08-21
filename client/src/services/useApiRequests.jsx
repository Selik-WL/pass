import { useContext } from 'react';

import AppContext from '../context/AppContext.jsx'

import Settings from '../services/Settings.js';
import processPaquet from '../services/getUpdate.jsx';

export default function ApiRequests() {

    const {
        credentials
    } = useContext(AppContext);
    
    const error = (message) => {
        return {
            'type':'error',
            'error':{
                'target':'server',
                'message':message
            }
        };
    };

    const getData = (route, method, body) => {
        const options = {
            'method': method,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            }
        };

        if (method !== 'GET' && method !== 'DELETE' && body) {
            options.body = JSON.stringify(body);
        }

        return fetch(Settings.api() + route, options)
        .catch((error) => {
            console.log(error);
            return null;
        })
        .then(response => {
            console.log(response);
            if (response === null)
                return error("Erreur réseau ou système inattendue."); 
            return response.json()
            .catch((error) => {
                console.log(error);
                return error("Réponse JSON invalide depuis l'API.");
            });
        })
        .then(data => {
            if (Settings.debug()) 
                console.group(`processing data for ${method} ${route}`);

            const response = processPaquet(data);

            if (Settings.debug()) 
                console.groupEnd();

            return response;
        })
    }

    const post = (route, body) => getData(route, 'POST', body);

    const get = (route) => getData(route, 'GET');

    const put = (route, body) => getData(route, 'PUT', body);

    const del = (route) => getData(route, 'DELETE');

    return {post, get, put, del};
}