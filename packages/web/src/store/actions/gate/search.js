import { normalize } from 'normalizr';

import { CALL_GATE } from 'store/middlewares/gate-api';
import { NEW_ENTITIES } from 'store/constants';
import { profileSchema, communitySchema } from 'store/schemas/gate';

// eslint-disable-next-line import/prefer-default-export
export const quickSearch = ({
  text,
  limit,
  entities = ['profiles', 'communities'],
}) => async dispatch => {
  const params = {
    queryString: text,
    limit,
    entities,
  };

  const results = await dispatch({
    [CALL_GATE]: {
      method: 'content.quickSearch',
      params,
    },
    meta: {
      ...params,
      waitAutoLogin: true,
    },
  });

  const splittedResults = {
    profiles: [],
    communities: [],
  };

  for (const item of results.items) {
    switch (item.type) {
      case 'profile':
        splittedResults.profiles.push(item);
        break;
      case 'community':
        splittedResults.communities.push(item);
        break;
      default:
      // Do nothing
    }
  }

  const normalizedResult = normalize(splittedResults, {
    profiles: [profileSchema],
    communities: [communitySchema],
  });

  if (normalizedResult) {
    dispatch({
      type: NEW_ENTITIES,
      payload: normalizedResult,
      error: null,
    });
  }

  return results;
};
