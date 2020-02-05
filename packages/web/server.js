const express = require('express');
const cookieParser = require('cookie-parser');
const next = require('next');
const path = require('path');
const nextI18NextMiddleware = require('next-i18next/middleware').default;
const cors = require('cors');

const routes = require('./src/shared/routes');
const i18n = require('./src/shared/i18n');

let host;

if (process.env.IN_DOCKER) {
  host = '0.0.0.0';
} else if (process.env.HOST) {
  host = process.env.HOST;
} else {
  host = '127.0.0.1';
}

const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({
  dev: process.env.NODE_ENV !== 'production',
  dir: path.resolve(__dirname, 'src'),
});

const handler = routes.getRequestHandler(app);

function documentsRedirect(req, res, nextCallback) {
  switch (req.path) {
    case '/doc/agreement':
      res.redirect('/docs/Commun User Agreement  29 Nov 2019 corrected 27 Dec.pdf');
      break;
    case '/doc/privacy':
      res.redirect('/docs/Commun Privacy Policy 29 Nov 2019 corrected 27 Dec.pdf');
      break;
    case '/doc/cookies':
      res.redirect('/docs/Commun Cookies Policy 29 Nov 2019.pdf');
      break;
    case '/doc/disclaimer':
      res.redirect('/docs/Commun Disclaimer 29 November 2019 corrected 27 Dec.pdf');
      break;
    case '/doc/whitepaper':
      res.redirect('/docs/Commun Whitepaper v 1.1 27 Dec.pdf');
      break;

    default:
      nextCallback();
  }
}

function api(req, res, nextCallback) {
  switch (req.path) {
    case '/api/payment/success':
      res.status(200).json({ status: 'success', data: req.query });
      break;

    default:
      nextCallback();
  }
}

async function run() {
  await app.prepare();

  const server = express();

  server.use(cors());
  server.use(cookieParser());
  server.use(documentsRedirect);
  server.use(api);
  server.use(nextI18NextMiddleware(i18n));
  server.use(express.static(path.join(__dirname, 'src/public')));

  await new Promise((resolve, reject) => {
    server.use(handler).listen({ host, port }, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  // eslint-disable-next-line no-console
  console.log(`> Ready on http://localhost:${port}`);
}

run().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
