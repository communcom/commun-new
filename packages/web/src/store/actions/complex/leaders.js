/* eslint-disable import/prefer-default-export */
import { clearVotes } from 'store/actions/commun';
import { normalizeCyberwayErrorMessage } from 'utils/errors';

export const clearAllVotes = ({ communityId }) => async dispatch => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await dispatch(clearVotes({ communityId }));
    } catch (err) {
      const error = normalizeCyberwayErrorMessage(err);
      if (error === 'no votes') {
        return null;
      }
      throw err;
    }
  }
};
