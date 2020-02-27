import { SET_CLIENT_ID } from 'store/constants';
import { checkAb } from 'utils/abTesting';

// eslint-disable-next-line import/prefer-default-export
export const setAbTestingClientId = clientId => ({
  type: SET_CLIENT_ID,
  payload: {
    clientId,
  },
});

export const getAbTestingValue = test => (dispatch, getState) => {
  const { clientId } = getState().ui.abTesting;
  return checkAb(test, clientId);
};
