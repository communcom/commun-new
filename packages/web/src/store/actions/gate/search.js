import { normalize } from 'normalizr';

import { NEW_ENTITIES } from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { communitySchema, postSchema, profileSchema } from 'store/schemas/gate';

const SEARCH_ROW_LIMIT = 4;

const SCHEMA_TYPES = {
  profiles: profileSchema,
  communities: communitySchema,
  posts: postSchema,
};

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

export const extendedSearch = ({ text, limit = 15 }) => ({
  [CALL_GATE]: {
    method: 'content.extendedSearch',
    params: {
      queryString: text,
      entities: {
        profiles: {
          limit: SEARCH_ROW_LIMIT,
          offset: 0,
        },
        communities: {
          limit: SEARCH_ROW_LIMIT,
          offset: 0,
        },
        posts: {
          limit,
          offset: 0,
        },
      },
    },
    schema: {
      profiles: {
        items: [profileSchema],
      },
      communities: {
        items: [communitySchema],
      },
      posts: {
        items: [postSchema],
      },
    },
  },
  meta: {
    text,
    getNormalizedResults: true,
    waitAutoLogin: true,
  },
});

export const entitySearch = ({ type, text, limit = 20, offset = 0 }) => ({
  [CALL_GATE]: {
    method: 'content.entitySearch',
    params: {
      queryString: text,
      entity: type,
      limit,
      offset,
    },
    schema: {
      items: [SCHEMA_TYPES[type]],
    },
  },
  meta: {
    type,
    text,
    limit,
    offset,
    getNormalizedResults: true,
    waitAutoLogin: true,
  },
});
