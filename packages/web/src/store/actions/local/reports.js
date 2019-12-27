import { REMOVE_REPORT } from 'store/constants';
import { formatContentId } from 'store/schemas/gate';

// eslint-disable-next-line import/prefer-default-export
export const removeReport = contentId => ({
  type: REMOVE_REPORT,
  payload: {
    contentUrl: formatContentId(contentId),
  },
});
