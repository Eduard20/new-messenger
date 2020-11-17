import { Buffer } from 'buffer';
import net from 'net';
import { types } from './constants.js';
import messages from './texts.js';
import logger from './services/logger.service.js';

export class DuplexServer {
  constructor(config) {
    this.guestId = 0;
    this.connections = new Set();
    this.port = config.port;
    this.userPrefix = config.userPrefix;
  }

  createServer() {
    net
      .createServer((socket) => {
        this.onConnect(socket);
        this.onNewMessage(socket);
        this.onDisconnect(socket);
      })
      .on('close', () => {
        logger.info(`${messages.serverStop} ${this.port}`);
      })
      .on('error', () => {
        logger.error(messages.serverError);
      })
      .listen(this.port, () => {
        logger.info(`${messages.serverStart} ${this.port}`);
      });
    return this;
  }

  changeUserPrefix(prefix) {
    this.userPrefix = prefix;
    return this;
  }

  onConnect(socket) {
    this.guestId++;
    socket.nickname = this.userPrefix + this.guestId;
    this.connections.add(socket);
    this.sendMessage(
      socket,
      types.INITIAL,
      Buffer.from(messages.welcome),
      'App'
    );
    this.sendBroadcastMessage(
      socket,
      types.CONNECT,
      Buffer.from(`${socket.nickname} joined this chat.`)
    );
  }

  onDisconnect(socket) {
    socket.on('end', () => {
      this.connections.delete(socket);
      this.sendBroadcastMessage(
        socket,
        types.DISCONNECT,
        Buffer.from(`${socket.nickname} left this chat!`)
      );
    });
  }

  onNewMessage(socket) {
    socket.on('data', (data) => {
      const message = data.toString().replace(/\n$/, '');
      this.sendBroadcastMessage(socket, types.MESSAGE, Buffer.from(message));
    });
  }

  sendBroadcastMessage(socketFrom, type, message) {
    if (!this.connections.size) {
      logger.info(messages.everyoneLeft);
      return;
    }

    logger.info(message.toString());
    this.connections.forEach((socket) => {
      if (socket.nickname === socketFrom.nickname) return;
      this.sendMessage(socket, type, message, socketFrom.nickname);
    }, this);
  }

  sendMessage(socket, type, message, nickname) {
    const meta = Buffer.alloc(1); // 1 byte
    meta[0] = type;
    const nicknameData = Buffer.alloc(256); // 256 bytes
    nicknameData.write(nickname);
    logger.info(nicknameData.toString());
    socket.write(Buffer.concat([meta, nicknameData, message]));
  }
}
