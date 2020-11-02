import 'dotenv/config.js';
import { environments, logLevels } from './constants.js';
const { PORT, NODE_ENV } = process.env;
const nodeEnv = NODE_ENV || environments.dev;

const port = PORT || 9000;
export default {
  port,
  userPrefix: 'Guest',
  logLevel: nodeEnv === environments.dev ? logLevels.debug : logLevels.info,
  loggerFormat: ':method :url (:status) :response-time ms'
};
