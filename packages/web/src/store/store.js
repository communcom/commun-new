import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { modalsMiddleware } from 'redux-modals-manager';

import { apiMiddleware, rpcMiddleware, apiGateMiddleware } from 'store/middlewares';
import rootReducer from 'store/reducers';
import { gateLogin, logout } from 'store/actions/gate';
import { getAuth } from 'utils/localStore';

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
  const middlewares = [
    skipEmptyMiddleware,
    thunkMiddleware,
    apiMiddleware,
    rpcMiddleware,
    apiGateMiddleware({
      autoLogin,
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

  if (process.env.NODE_ENV === 'development' && process.browser) {
    // eslint-disable-next-line no-underscore-dangle
    window.__store = store;
  }

  return store;
};
