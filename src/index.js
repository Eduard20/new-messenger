import { DuplexServer } from './server.js';
import config from './config.js';

const server = new DuplexServer(config);
server.createServer().changeUserPrefix(config.userPrefix);
