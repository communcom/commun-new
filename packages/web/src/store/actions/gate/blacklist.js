import { FETCH_USERS_BLACKLIST, FETCH_COMMUNITIES_BLACKLIST } from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { userSchema, communitySchema } from 'store/schemas/gate';

const USERS_TYPE = 'users';
const COMMUNITIES_TYPE = 'communities';

const fetchBlacklist = (type, actionName) => ({ userId, offset, limit = 20 }) => {
  const params = {
    userId,
    type,
    offset,
    limit,
  };

  return {
    [CALL_GATE]: {
      types: [actionName, `${actionName}_SUCCESS`, `${actionName}_ERROR`],
      method: 'content.getBlacklist',
      params,
      schema: {
        items: type === USERS_TYPE ? [userSchema] : [communitySchema],
      },
    },
    meta: {
      ...params,
      waitAutoLogin: true,
    },
  };
};

export const fetchUsersBlacklist = fetchBlacklist(USERS_TYPE, FETCH_USERS_BLACKLIST);
export const fetchCommunitiesBlacklist = fetchBlacklist(
  COMMUNITIES_TYPE,
  FETCH_COMMUNITIES_BLACKLIST
);
