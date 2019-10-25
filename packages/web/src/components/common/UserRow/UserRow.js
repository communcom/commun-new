/* eslint-disable no-alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { InvisibleText } from '@commun/ui';

import { userType } from 'types/common';
import { displaySuccess, displayError } from 'utils/toastsMessages';

import { ProfileLink } from 'components/links';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';

import {
  Item,
  ItemText,
  ItemNameLink,
  StatsWrapper,
  StatsItem,
  ButtonsWrapper,
  FollowButton,
  AvatarStyled,
  MoreActions,
  MoreIcon,
} from './UserRow.styled';

export default class UserRow extends Component {
  static propTypes = {
    user: userType.isRequired,
    isOwner: PropTypes.bool,
    isOwnerUser: PropTypes.bool,

    pin: PropTypes.func.isRequired,
    unpin: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOwner: false,
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

  renderButtons(isSubscribed) {
    const { isOwnerUser } = this.props;
    const text = isSubscribed ? 'Unfollow' : 'Follow';

    if (isOwnerUser) {
      return null;
    }

    if (isSubscribed) {
      return (
        <DropDownMenu
          align="right"
          openAt="bottom"
          handler={props => (
            <MoreActions {...props} name="profile-followers__more-actions">
              <MoreIcon name="more" />
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
      <FollowButton
        name="profile-followers__subscribe"
        title={text}
        onClick={this.onClickToggleFollow}
      >
        {text}
      </FollowButton>
    );
  }

  render() {
    const { user } = this.props;
    const { userId, username, isSubscribed, postsCount, subscribersCount } = user;

    return (
      <Item key={userId}>
        <AvatarStyled userId={userId} useLink />
        <ItemText>
          <ProfileLink user={user}>
            <ItemNameLink>{username}</ItemNameLink>
          </ProfileLink>
          <StatsWrapper>
            <StatsItem>{`${subscribersCount || 0} followers`}</StatsItem>
            <StatsItem isSeparator>{` \u2022 `}</StatsItem>
            <StatsItem>{`${postsCount || 0} posts`}</StatsItem>
          </StatsWrapper>
        </ItemText>
        <ButtonsWrapper>{this.renderButtons(isSubscribed)}</ButtonsWrapper>
      </Item>
    );
  }
}
