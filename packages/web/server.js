const express = require('express');
const cookieParser = require('cookie-parser');
const next = require('next');
const path = require('path');
const nextI18NextMiddleware = require('next-i18next/middleware').default;
const cors = require('cors');

const AB_TESTING_ID_PRECISION = 10 ** 10;

if (!process.env.IN_DOCKER) {
  // eslint-disable-next-line global-require
  require('dotenv').config({
    path: path.join(__dirname, '../../.env'),
  });
}

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

function abTestingIdCheck(req, res, nextCallback) {
  if (!req.cookies.commun_client_id) {
    const now = new Date();
    const monthNumber = (now.getFullYear() - 2000) * 12 + now.getMonth();
    const rnd = Math.floor(Math.random() * AB_TESTING_ID_PRECISION);
    const id = (monthNumber * AB_TESTING_ID_PRECISION + rnd).toString();

    const expiration = new Date();
    expiration.setFullYear(expiration.getFullYear() + 10);

    res.setHeader(
      'Set-Cookie',
      `commun_client_id=${id}; path=/; expires=${expiration.toGMTString()}`
    );

    req.cookies.commun_client_id = id;
  }

  nextCallback();
}

function api(req, res, nextCallback) {
  switch (req.path) {
    case '/api/payment/success':
      // if from request in component "Exchange2FA"
      if (req.headers['x-commun-2fa']) {
        res.status(200).json({ status: 'success', data: req.query });
      } else {
        res.status(200).sendFile(path.join(__dirname, 'src/public/payment/success.html'));
      }
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
  server.use(abTestingIdCheck);
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
