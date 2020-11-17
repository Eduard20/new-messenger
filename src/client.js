import net from 'net';
import readline from 'readline';
import { types } from './constants.js';
import logger from './services/logger.service.js';
import messages from './texts.js';
import config from './config.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Messenger> '
});

const clients = net.connect(config, () => {
  logger.info(messages.connected);
});

clients.on('error', (error) => {
  logger.error(error.message);
});

clients.on('data', (data) => {
  process.stdout.clearLine(-1);
  process.stdout.cursorTo(0);
  const type = data[0];
  const messageFrom = data.slice(1, 257).toString();
  const message = data.slice(257).toString();

  switch (type) {
    case types.CONNECT:
      logger.info(`C ${messageFrom} ${messages.userConnected}`);
      break;
    case types.DISCONNECT:
      logger.info(`D ${messageFrom} ${messages.userDisconnected}`);
      break;
    case types.MESSAGE:
      logger.info(`M ${messageFrom} ${message || messages.unknownMessage}`);
      break;
    case types.INITIAL:
      logger.info(`W ${messageFrom} ${message}`);
      break;
    default:
      logger.info(messages.invalidType);
      break;
  }
  rl.prompt();
});

clients.on('end', () => {
  logger.info(messages.disconnected);
});

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'exit':
      rl.close();
      break;
    case '/w':
      // TODO: private message
      break;
    default:
      clients.write(line.trim());
      break;
  }
  rl.prompt();
}).on('close', () => {
  logger.info(messages.disconnected);
  clients.end();
  process.exit(0);
});
