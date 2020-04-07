/* eslint-disable import/prefer-default-export */
import { i18n } from 'shared/i18n';
import { entitySelector, statusSelector } from 'store/selectors/common';
import { openConfirmDialog } from 'store/actions/modals/confirm';

export const getIsAllowedFollowUser = (userId, unblock) => async (dispatch, getState) => {
  const state = getState();
  const userProfile = entitySelector('profiles', userId)(state);
  const usersBlacklist = statusSelector(['usersBlacklist', 'order'])(state);
  let result = true;

  if (userProfile?.isInBlacklist || usersBlacklist.includes(userId)) {
    result = await dispatch(
      openConfirmDialog(i18n.t('modals.confirm_dialog.blocked_user'), {
        confirmText: i18n.t('common.follow'),
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

  if (userProfile?.isSubscribed) {
    await dispatch(unfollow(userId));
  }
};
