/* eslint-disable global-require */

import { normalize } from 'normalizr';

import { currentUnsafeServerUserIdSelector } from 'store/selectors/auth';
import CurrentRequests from './utils/CurrentRequests';

export const CALL_GATE = 'CALL_GATE';

export default ({ autoLogin }) => ({ getState, dispatch }) => next => {
  let client = null;
  let autoAuthPromise = null;
  let initialAuthPromiseResolve = null;

  if (process.browser) {
    autoAuthPromise = new Promise(resolve => {
      initialAuthPromiseResolve = resolve;
    });
  }

  if (process.browser) {
    const GateWsClient = require('./clients/GateWsClient').default;
    client = new GateWsClient({
      onConnect: async () => {
        const action = autoLogin();

        if (action) {
          autoAuthPromise = await dispatch(action);
        } else {
          autoAuthPromise = null;
        }

        initialAuthPromiseResolve();
      },
    });
  } else {
    const FacadeClient = require('./clients/FacadeClient').default;
    client = new FacadeClient();
  }

  const currentRequests = new CurrentRequests();

  return async action => {
    if (!action || !action[CALL_GATE]) {
      return next(action);
    }

    const gateCall = action[CALL_GATE];

    const actionWithoutCall = { ...action };
    delete actionWithoutCall[CALL_GATE];

    const { types, method, params, schema, postProcess } = gateCall;
    const [requestType, successType, failureType] = types || [];

    if (requestType && action.meta?.abortPrevious) {
      currentRequests.abortByType(requestType);
    }

    const requestInfo = {
      requestType,
      actionWithoutCall,
      isCanceled: false,
    };

    requestInfo.promise = new Promise(async (resolve, reject) => {
      requestInfo.reject = reject;

      if (requestType) {
        next({
          ...actionWithoutCall,
          type: requestType,
          payload: null,
          error: null,
        });
      }

      try {
        if (action.meta?.waitAutoLogin && autoAuthPromise) {
          await autoAuthPromise;
        }

        if (requestInfo.isCanceled) {
          return;
        }

        let userId;

        if (!process.browser) {
          userId = currentUnsafeServerUserIdSelector(getState());
        }

        let result = await client.callApi(method, params, userId);

        if (postProcess) {
          const processedResult = postProcess(result, params);

          if (processedResult !== undefined) {
            result = processedResult;
          }
        }

        let normalizedResult = null;

        if (requestInfo.isCanceled) {
          return;
        }

        if (schema) {
          try {
            normalizedResult = normalize(result, schema);
            normalizedResult.originalResult = result;
          } catch (err) {
            err.message = `Normalization failed: ${err.message}`;
            reject(err);
            return;
          }
        }

        if (successType) {
          next({
            ...actionWithoutCall,
            type: successType,
            payload: normalizedResult || result,
            error: null,
          });
        }

        resolve(result);
      } catch (err) {
        if (failureType) {
          next({
            ...actionWithoutCall,
            type: failureType,
            payload: null,
            error: err,
          });
        }

        reject(err);
      }
    });

    currentRequests.add(requestInfo);
    const result = await requestInfo.promise;
    currentRequests.remove(requestInfo);

    return result;
  };
};
