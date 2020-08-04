import commun from 'commun-client';

export const CYBERWAY_RPC = 'CYBERWAY';

const rpc = () => next => async action => {
  if (!action || !action[CYBERWAY_RPC]) {
    return next(action);
  }

  const actionWithoutCall = { ...action };
  delete actionWithoutCall[CYBERWAY_RPC];

  const { types, method, params } = action[CYBERWAY_RPC];
  const [requestType, successType, failureType] = types;

  next({
    ...actionWithoutCall,
    type: requestType,
    payload: null,
    error: null,
  });

  try {
    const result = await commun.rpc[method](params);

    next({
      ...actionWithoutCall,
      type: successType,
      payload: result,
      error: null,
    });

    return result;
  } catch (err) {
    next({
      ...actionWithoutCall,
      type: failureType,
      payload: null,
      error: err,
    });

    throw err;
  }
};

export default rpc;
