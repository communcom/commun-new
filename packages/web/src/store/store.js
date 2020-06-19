import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { modalsMiddleware } from 'redux-modals-manager';
import thunkMiddleware from 'redux-thunk';

import { getAuth } from 'utils/localStore';
import { gateLogin, logout } from 'store/actions/gate';
import { apiGateMiddleware, apiMiddleware, rpcMiddleware } from 'store/middlewares';
import rootReducer from 'store/reducers';

function autoLogin() {
  let auth;

  try {
    auth = getAuth();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Invalid authorization data:', err);
    return logout();
  }

  if (!auth) {
    // Если auth нет, то делаем logout чтобы сбросить на всякий случай cookie
    return logout({ preventRedirect: true, skipAuthClear: true });
  }

  return gateLogin(auth, { isAutoLogging: true });
}

function skipEmptyMiddleware() {
  // eslint-disable-next-line consistent-return
  return next => action => {
    if (action) {
      return next(action);
    }
  };
}

export default (state = {}) => {
  let tracingCallback = null;

  const middlewares = [
    skipEmptyMiddleware,
    thunkMiddleware,
    apiMiddleware,
    rpcMiddleware,
    apiGateMiddleware({
      autoLogin,
      setTracingCallback: callback => {
        tracingCallback = callback;
      },
    }),
    modalsMiddleware,
  ];

  if (process.env.NODE_ENV !== 'production' && (process.env.REDUX_LOGGER || process.browser)) {
    // eslint-disable-next-line
    const { createLogger } = require('redux-logger');
    middlewares.push(createLogger());
  }

  const store = createStore(
    rootReducer,
    state,
    composeWithDevTools(applyMiddleware(...middlewares))
  );

  store.setTracing = ctx => {
    tracingCallback(ctx);
  };

  if (process.env.NODE_ENV === 'development' && process.browser) {
    // eslint-disable-next-line no-underscore-dangle
    window.__store = store;
  }

  return store;
};
