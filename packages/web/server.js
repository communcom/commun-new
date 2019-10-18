const express = require('express');
const cookieParser = require('cookie-parser');
const next = require('next');
const path = require('path');
const nextI18NextMiddleware = require('next-i18next/middleware');

const routes = require('./src/shared/routes');
const i18n = require('./src/shared/i18n');

const host = process.env.HOST || '127.0.0.1';
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.resolve(__dirname, 'src') });
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = express();

  server.use(cookieParser());
  server.use(nextI18NextMiddleware(i18n));
  server.use(express.static(path.join(__dirname, 'src/static')));

  server.use(handler).listen({ host, port }, err => {
    if (err) {
      throw err;
    }
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`);
  });
});
