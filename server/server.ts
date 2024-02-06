import http from 'http';
import https from 'https';
import fs from 'fs';
import express from 'express';
import { config } from 'dotenv';
import { WebSocketServer } from 'ws';
import path from 'node:path';
import { handleEventMessage } from './handlers/message/handleEventMessage.js';
import { handleEventClose } from './handlers/close/handleEventClose.js';
import { handleEventOpen } from './handlers/open/handleEventOpen.js';

config();

const httpPort = process.env.HTTP_PORT || 80;
const httpsPort = process.env.HTTPS_PORT || 443;

const app = express();

try {
  const privateKeyPath = process.env.SSL_KEY as string;
  const publicKeyPath = process.env.SSL_CERT as string;
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const certificate = fs.readFileSync(publicKeyPath, 'utf8');
  const credentials = { key: privateKey, cert: certificate };
  const httpsServer = https.createServer(credentials, app);

  const webSocketServerS = new WebSocketServer({ server: httpsServer });

  webSocketServerS.on('connection', (ws) => {
    handleEventOpen(ws);
    ws.on('message', (m, isBinary) => {
      const message = isBinary ? m : m.toString();
      handleEventMessage(message, ws);
    });
    ws.on('close', () => {
      handleEventClose(ws);
    });
  });

  httpsServer.listen(httpsPort, () => {
    // eslint-disable-next-line no-console
    console.log(`HTTPS Server listening on port ${httpsPort}`);
  });
} catch (ex) {
  // eslint-disable-next-line no-console
  console.error('Certificates not found. Not using HTTPS', ex);
}

const httpServer = http.createServer(app);

const staticPath = `${process.cwd()}/client/dist`;

app.use('/', express.static(staticPath));

console.log({ staticPath });

const webSocketServer = new WebSocketServer({ server: httpServer });

webSocketServer.on('connection', (ws) => {
  handleEventOpen(ws);
  ws.on('message', (m, isBinary) => {
    const message = isBinary ? m : m.toString();
    handleEventMessage(message, ws);
  });
  ws.on('close', () => {
    handleEventClose(ws);
  });
});

httpServer.listen(httpPort, () => {
  // eslint-disable-next-line no-console
  console.log(`HTTP Server listening on port ${httpPort}`);
});
