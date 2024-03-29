/* eslint-disable import/prefer-default-export */

import {
  FETCH_COMMENTS_REPORTS_LIST,
  FETCH_COMMENTS_REPORTS_LIST_ERROR,
  FETCH_COMMENTS_REPORTS_LIST_SUCCESS,
  FETCH_REPORTS_ENTITY,
  FETCH_REPORTS_ENTITY_ERROR,
  FETCH_REPORTS_ENTITY_SUCCESS,
  FETCH_REPORTS_LIST,
  FETCH_REPORTS_LIST_ERROR,
  FETCH_REPORTS_LIST_SUCCESS,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { postSchema, profileCommentSchema, reportSchema } from 'store/schemas/gate';
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

  const types =
    contentType === 'post'
      ? [FETCH_REPORTS_LIST, FETCH_REPORTS_LIST_SUCCESS, FETCH_REPORTS_LIST_ERROR]
      : [
          FETCH_COMMENTS_REPORTS_LIST,
          FETCH_COMMENTS_REPORTS_LIST_SUCCESS,
          FETCH_COMMENTS_REPORTS_LIST_ERROR,
        ];

  return dispatch({
    [CALL_GATE]: {
      types,
      method: 'content.getReportsList',
      params,
      schema: {
        items: [contentType === 'post' ? postSchema : profileCommentSchema],
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
