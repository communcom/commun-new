import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { dataSelector } from './common';

export const regDataSelector = dataSelector('registration');

export const fullNumberSelector = dataSelector(['registration', 'fullPhoneNumber']);

export const pdfDataSelector = state => {
  const user = currentUnsafeUserSelector(state);
  const regData = regDataSelector(state);

  return {
    userId: user?.userId,
    username: user?.username,
    phone: regData?.phone,
    keys: regData?.keys,
  };
};
