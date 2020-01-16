/* eslint-disable no-alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { InvisibleText } from '@commun/ui';

import { userType } from 'types/common';
import { displaySuccess, displayError } from 'utils/toastsMessages';

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
    const { user, pin, unpin, waitForTransaction, fetchProfile } = this.props;
    const { userId, isSubscribed } = user;

    try {
      let result;
      if (isSubscribed) {
        result = await unpin(userId);
        displaySuccess('User unfollowed');
      } else {
        result = await pin(userId);
        displaySuccess('User followed');
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
    const { user, unblockUser, fetchProfile, waitForTransaction } = this.props;

    try {
      const result = await unblockUser(user.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: user.userId });
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }
  };

  renderButtons(isSubscribed) {
    const { user, isOwnerUser, isBlacklist } = this.props;
    const text = isSubscribed ? 'Unfollow' : 'Follow';

    if (isOwnerUser) {
      return null;
    }

    if (isBlacklist) {
      return (
        <AsyncAction onClickHandler={this.onUnblockClick}>
          <UnblockButton name="blacklist__unblock" title={text}>
            <UnblockIcon />
            <InvisibleText>Unblock {user.username}</InvisibleText>
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
              <InvisibleText>More</InvisibleText>
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
    const { user, isBlacklist, className } = this.props;
    const { userId, username, isSubscribed, postsCount, subscribersCount } = user;

    return (
      <Item className={className}>
        <AvatarStyled userId={userId} useLink />
        <ItemText isFollowed={isSubscribed} isBlacklist={isBlacklist}>
          <ProfileLink user={user}>
            <ItemNameLink>{username}</ItemNameLink>
          </ProfileLink>
          <StatsWrapper>
            <StatsItem>{`${subscribersCount || 0} followers`}</StatsItem>
            <StatsItem isSeparator>{` \u2022 `}</StatsItem>
            <StatsItem>{`${postsCount || 0} posts`}</StatsItem>
          </StatsWrapper>
        </ItemText>
        {this.renderButtons(isSubscribed)}
      </Item>
    );
  }
}
