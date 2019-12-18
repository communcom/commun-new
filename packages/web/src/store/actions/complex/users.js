/* eslint-disable import/prefer-default-export */
import { entitySelector, statusSelector } from 'store/selectors/common';
import { openConfirmDialog } from 'store/actions/modals/confirm';

export const getIsAllowedFollowUser = (userId, unblock) => async (dispatch, getState) => {
  const state = getState();
  const usersBlacklist = statusSelector(['usersBlacklist', 'order'])(state);
  let result = true;

  if (usersBlacklist.includes(userId)) {
    result = await dispatch(
      openConfirmDialog('You have blocked this user. Do you want unblock and follow?', {
        confirmText: 'Follow',
      })
    );

    if (result && unblock) {
      await dispatch(unblock(userId));
    }
  }

  return result;
};

export const unfollowUserIfNeed = (userId, unfollow) => async (dispatch, getState) => {
  const state = getState();
  const userProfile = entitySelector('profiles', userId)(state);

  if (userProfile) {
    if (userProfile.isSubscribed) {
      await dispatch(unfollow(userId));
    }
  }
};
