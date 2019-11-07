import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';

// eslint-disable-next-line import/prefer-default-export
export const prepareLeaderCommunitiesSelector = selectedIds => state => {
  let leaderIn = [];

  const userId = currentUnsafeUserIdSelector(state);
  if (userId) {
    const profile = entitySelector('profiles', userId)(state);
    if (profile) {
      // eslint-disable-next-line prefer-destructuring
      leaderIn = profile.leaderIn;
    }
  }

  if (!selectedIds || selectedIds.length === 0) {
    return undefined;
  }

  if (selectedIds.length === leaderIn.length && selectedIds.every(id => leaderIn.includes(id))) {
    return undefined;
  }

  return selectedIds;
};
