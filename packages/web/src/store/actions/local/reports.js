import { REMOVE_REPORT } from 'store/constants';
import { formatContentId } from 'store/schemas/gate';

export const removeReport = contentId => ({
  type: REMOVE_REPORT,
  payload: {
    contentUrl: formatContentId(contentId),
  },
});
