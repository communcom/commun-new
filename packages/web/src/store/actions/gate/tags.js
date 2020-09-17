import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchTrendingTags = ({ offset = 0, limit = 5 } = {}) => {
  const params = {
    offset,
    limit,
  };

  return {
    [CALL_GATE]: {
      method: 'content.getTrendingTags',
      params,
      meta: params,
    },
  };
};
