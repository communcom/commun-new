import { REMOVE_REPORT, REMOVE_COMMENT_REPORT } from 'store/constants';
import { formatContentId } from 'store/schemas/gate';

// eslint-disable-next-line import/prefer-default-export
export const removeReport = contentId => ({
  type: REMOVE_REPORT,
  payload: {
    contentUrl: formatContentId(contentId),
  },
});

export const removeCommentReport = contentId => ({
  type: REMOVE_COMMENT_REPORT,
  payload: {
    contentUrl: formatContentId(contentId),
  },
});
