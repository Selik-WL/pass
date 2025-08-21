import dotenv from 'dotenv';
import * as http from 'http';

import app from '../main/app.js';

dotenv.config();
//
const PORT = process.env.PORT || 8519;
const IP = process.env.IP || '127.0.0.1';
const server = http.createServer(app());

server.listen(PORT, IP, () => console.log(`Le serveur écoute sur le port ${PORT}`));

/*
helmet,cors,rate-limit,compression,express.json
*/