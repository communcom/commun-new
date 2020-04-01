/* eslint-disable no-alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { InvisibleText } from '@commun/ui';

import { userType } from 'types/common';
import { displaySuccess, displayError } from 'utils/toastsMessages';
import { withTranslation } from 'shared/i18n';

import { ProfileLink } from 'components/links';
import AsyncAction from 'components/common/AsyncAction';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';

import {
  Item,
  ItemText,
  ItemNameLink,
  StatsWrapper,
  StatsItem,
  FollowButton,
  AvatarStyled,
  MoreActions,
  MoreIcon,
  UnblockButton,
  UnblockIcon,
} from './UserRow.styled';

@withTranslation()
export default class UserRow extends Component {
  static propTypes = {
    user: userType.isRequired,
    isOwnerUser: PropTypes.bool,
    isBlacklist: PropTypes.bool,

    pin: PropTypes.func.isRequired,
    unpin: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isBlacklist: false,
    isOwnerUser: false,
  };

  onClickToggleFollow = async () => {
    const { user, pin, unpin, waitForTransaction, fetchProfile, t } = this.props;
    const { userId, isSubscribed } = user;

    try {
      let result;
      if (isSubscribed) {
        result = await unpin(userId);
        displaySuccess(t('toastsMessages.user.unfollowed'));
      } else {
        result = await pin(userId);
        displaySuccess(t('toastsMessages.user.followed'));
      }
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId });
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return;
      }
      displayError(err);
    }
  };

  onUnblockClick = async () => {
    const { user, unblockUser, fetchProfile, waitForTransaction, t } = this.props;

    try {
      const result = await unblockUser(user.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: user.userId });
      displaySuccess(t('toastsMessages.success'));
    } catch (err) {
      displayError(err);
    }
  };

  renderButtons(isSubscribed) {
    const { user, isOwnerUser, isBlacklist, t } = this.props;
    const text = isSubscribed ? t('common.unfollow') : t('common.follow');

    if (isOwnerUser) {
      return null;
    }

    if (isBlacklist) {
      return (
        <AsyncAction onClickHandler={this.onUnblockClick}>
          <UnblockButton
            name="blacklist__unblock"
            title={`${t('common.unblock')} ${user.username}`}
          >
            <UnblockIcon />
            <InvisibleText>
              {t('common.unblock')} {user.username}
            </InvisibleText>
          </UnblockButton>
        </AsyncAction>
      );
    }

    if (isSubscribed) {
      return (
        <DropDownMenu
          align="right"
          openAt="top"
          handler={props => (
            <MoreActions {...props} name="profile-followers__more-actions">
              <MoreIcon />
              <InvisibleText>{t('common.more')}</InvisibleText>
            </MoreActions>
          )}
          items={() => (
            <DropDownMenuItem
              name="profile-followers__unsubscribe"
              onClick={this.onClickToggleFollow}
            >
              {text}
            </DropDownMenuItem>
          )}
        />
      );
    }

    return (
      <AsyncAction onClickHandler={this.onClickToggleFollow}>
        <FollowButton name="profile-followers__subscribe" title={text}>
          {text}
        </FollowButton>
      </AsyncAction>
    );
  }

  render() {
    const { user, isBlacklist, t, className } = this.props;
    const { userId, username, isSubscribed, postsCount, subscribersCount } = user;

    return (
      <Item className={className}>
        <AvatarStyled userId={userId} useLink />
        <ItemText isFollowed={isSubscribed} isBlacklist={isBlacklist}>
          <ProfileLink user={user}>
            <ItemNameLink>{username}</ItemNameLink>
          </ProfileLink>
          <StatsWrapper>
            <StatsItem>
              {subscribersCount} {t('common.counters.follower', { count: subscribersCount })}
            </StatsItem>
            <StatsItem isSeparator>{` \u2022 `}</StatsItem>
            <StatsItem>
              {postsCount} {t('common.counters.post', { count: postsCount })}
            </StatsItem>
          </StatsWrapper>
        </ItemText>
        {this.renderButtons(isSubscribed)}
      </Item>
    );
  }
}
