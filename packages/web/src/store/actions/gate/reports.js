/* eslint-disable import/prefer-default-export */

import { CALL_GATE } from 'store/middlewares/gate-api';

import {
  FETCH_REPORTS_LIST,
  FETCH_REPORTS_LIST_SUCCESS,
  FETCH_REPORTS_LIST_ERROR,
  FETCH_REPORTS_ENTITY,
  FETCH_REPORTS_ENTITY_SUCCESS,
  FETCH_REPORTS_ENTITY_ERROR,
} from 'store/constants';
import { postSchema, commentSchema, reportSchema } from 'store/schemas/gate';
import { prepareLeaderCommunitiesSelector } from 'store/selectors/community';

export const fetchReportsList = ({
  contentType = 'post',
  communityIds,
  status = 'open',
  sortBy = 'timeDesc',
  limit = 20,
  offset = 0,
}) => (dispatch, getState) => {
  const params = {
    contentType,
    communityIds: prepareLeaderCommunitiesSelector(communityIds)(getState()),
    status,
    sortBy,
    limit,
    offset,
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_REPORTS_LIST, FETCH_REPORTS_LIST_SUCCESS, FETCH_REPORTS_LIST_ERROR],
      method: 'content.getReportsList',
      params,
      schema: {
        items: [contentType === 'post' ? postSchema : commentSchema],
      },
    },
    meta: {
      ...params,
      waitAutoLogin: true,
    },
  });
};

export const fetchEntityReports = ({ communityId, userId, permlink, limit = 20, offset = 0 }) => {
  const params = {
    communityId,
    userId,
    permlink,
    limit,
    offset,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_REPORTS_ENTITY, FETCH_REPORTS_ENTITY_SUCCESS, FETCH_REPORTS_ENTITY_ERROR],
      method: 'content.getEntityReports',
      params,
      schema: {
        items: [reportSchema],
      },
      postProcess: results => {
        for (const item of results.items) {
          item.contentId = {
            communityId,
            userId,
            permlink,
          };
        }
      },
    },
    meta: {
      ...params,
      waitAutoLogin: true,
    },
  };
};
