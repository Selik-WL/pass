import dotenv from 'dotenv';
import * as http from 'http';

import app from '../main/app.js';

dotenv.config();

const PORT = process.env.PORT || 8519;
const server = http.createServer(app());

server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}.`));

/*
helmet,cors,rate-limit,compression,express.json
*/