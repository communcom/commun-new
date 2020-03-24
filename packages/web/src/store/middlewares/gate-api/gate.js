/* eslint-disable global-require */

import { normalize } from 'normalizr';

import { isWebViewSelector } from 'store/selectors/common';
import { currentUnsafeServerUserIdSelector } from 'store/selectors/auth';
import { displayError } from 'utils/toastsMessages';
import { analyzeUserAgent } from 'utils/userAgent';
import { processNewNotification } from 'store/actions/gate/notifications';
import { notificationSchema } from 'store/schemas/gate';
import { NEW_ENTITIES, FETCH_NOTIFICATIONS_STATUS_SUCCESS } from 'store/constants/actionTypes';

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

  // TODO: Temporary constant SSR user-agent, need to change to req.headers['user-agent] in future
  const userAgent = process.browser
    ? navigator.userAgent
    : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';

  const clientInfo = {
    ...analyzeUserAgent(userAgent, isWebViewSelector(getState())),
    version: '1.7.0',
  };

  if (process.browser) {
    const GateWsClient = require('./clients/GateWsClient').default;

    client = new GateWsClient({
      clientInfo,
      onConnect: async () => {
        const action = autoLogin();

        if (action) {
          autoAuthPromise = dispatch(action);

          try {
            await autoAuthPromise;
          } catch (err) {
            displayError(err);
          }
        }

        autoAuthPromise = null;
        initialAuthPromiseResolve();
      },
      onNotification: async notification => {
        try {
          const normalizedResult = normalize(notification, notificationSchema);

          dispatch({
            type: NEW_ENTITIES,
            payload: normalizedResult,
            error: null,
          });

          await dispatch(processNewNotification(notification));
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Notification processing failed:', err);
        }
      },
      onNotificationStatusUpdate: status => {
        dispatch({
          type: FETCH_NOTIFICATIONS_STATUS_SUCCESS,
          payload: status,
        });
      },
    });
  } else {
    const FacadeClient = require('./clients/FacadeClient').default;
    client = new FacadeClient({
      clientInfo,
    });
  }

  const currentRequests = new CurrentRequests();

  return async action => {
    if (!action || !action[CALL_GATE]) {
      return next(action);
    }

    const gateCall = action[CALL_GATE];

    const actionWithoutCall = { ...action };
    delete actionWithoutCall[CALL_GATE];

    const { types, method, params = {}, schema, postProcess } = gateCall;
    const [requestType, successType, failureType] = types || [];
    const meta = action.meta || {};

    if (requestType && meta.abortPrevious) {
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
        if (meta.waitAutoLogin && autoAuthPromise) {
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
        let successPayload = null;

        if (requestInfo.isCanceled) {
          return;
        }

        if (schema) {
          try {
            normalizedResult = normalize(result, schema);
            successPayload = {
              ...normalizedResult,
              originalResult: result,
            };
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
            payload: successPayload || result,
            error: null,
          });
        } else if (schema) {
          next({
            ...actionWithoutCall,
            type: NEW_ENTITIES,
            payload: successPayload,
            error: null,
          });
        }

        if (meta.getNormalizedResults && normalizedResult) {
          resolve(normalizedResult.result);
        } else {
          resolve(result);
        }
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
