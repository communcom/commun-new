/* eslint-disable import/prefer-default-export */

import { CALL_GATE } from 'store/middlewares/gate-api';

export const lookupGeoIp = () => ({
  [CALL_GATE]: {
    method: 'geoip.lookup',
    params: {},
  },
});
