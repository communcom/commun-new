import { Client } from 'rpc-websockets';

import { toQueryString, analyzeUserAgent } from 'utils/userAgent';

import GateError from '../errors/GateError';

export default class GateWsClient {
  constructor({ onConnect }) {
    this.queue = [];

    const url = process.env.WEB_GATE_CONNECT;

    if (!url) {
      // eslint-disable-next-line no-console
      console.error('Env variable "WEB_GATE_CONNECT" hasn\'t set');
      return;
    }

    const query = toQueryString(analyzeUserAgent(navigator.userAgent));

    this.url = `${url}${url.endsWith('/') ? '' : '/'}connect?${query}`;

    this.onConnect = onConnect;

    this.connect().catch(err => {
      // eslint-disable-next-line no-console
      console.error('WebSocket connect failed:', err);
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      const socket = new Client(this.url);

      let connected = false;

      socket.on('open', async () => {
        connected = true;
        this.socket = socket;

        await this.onConnect();
        resolve();
        this.flushQueue();
      });

      socket.on('error', err => {
        // eslint-disable-next-line no-console
        console.error('WebSocket disconnected:', err);
        reject(err);

        if (connected) {
          this.close();
          this.connect();
        }
      });
    });
  }

  close() {
    if (this.socket) {
      try {
        this.socket.close();
      } catch (err) {
        // Ignore errors when closing
      }

      this.socket = null;
    }
  }

  flushQueue() {
    for (const item of this.queue) {
      clearTimeout(item.timeoutId);
      item.resolve(this.callApi(item.apiName, item.params));
    }
    this.queue = [];
  }

  callApi(apiName, params) {
    if (!this.socket) {
      return new Promise((resolve, reject) => {
        const delayedItem = {
          apiName,
          params,
          resolve,
          reject,
          timeoutId: setTimeout(() => {
            this.queue = this.queue.filter(item => item !== delayedItem);
            reject(new Error('Queue timeout error'));
          }, 5000),
        };

        this.queue.push(delayedItem);
      });
    }

    return this.socketCall(apiName, params);
  }

  async socketCall(apiName, params) {
    try {
      return await this.socket.call(apiName, params);
    } catch (err) {
      throw new GateError(err, apiName);
    }
  }
}
