import express from 'express';
import path from 'path';

const __dirname = import.meta.dirname;
const PORT = process.env.PORT || 8519;
const server = express();

console.log('Serving static from: ', path.join(__dirname, '../../client/dist'));
console.log('Serving index.html file at: ', path.join(__dirname, '../../client/dist/index.html'));

server.use(express.static(path.join(__dirname, '../../client/dist')));
server.get('/*path', (req,res) => res.sendFile(path.join(__dirname, '../../client/dist/index.html')));

server.listen(PORT);
