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

  renderFollowButton(isSubscribed) {
    const { isOwner } = this.props;
    const text = isSubscribed ? 'Unfollow' : 'Follow';

    if (isOwner) {
      if (isSubscribed) {
        return null;
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

    return (
      <FollowButton
        name={isSubscribed ? 'profile-followers__subscribe' : 'profile-followers__subscribe'}
        title={text}
        onClick={this.onClickToggleFollow}
      >
        {text}
      </FollowButton>
    );
  }

  renderButtons(isSubscribed) {
    const { isOwnerUser, isOwner } = this.props;
    const text = isSubscribed ? 'Unfollow' : 'Follow';

    if (isOwnerUser) {
      return null;
    }

    return (
      <ButtonsWrapper>
        {this.renderFollowButton(isSubscribed)}
        {isOwner && isSubscribed ? (
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
        ) : null}
      </ButtonsWrapper>
    );
  }

  render() {
    const { user } = this.props;
    const { userId, username, isSubscribed } = user;

    return (
      <Item key={userId}>
        <AvatarStyled userId={userId} useLink />
        <ItemText>
          <ProfileLink user={user}>
            <ItemNameLink>{username}</ItemNameLink>
          </ProfileLink>
          <StatsWrapper>
            {/* TODO: should be replaced with real data when backend will be ready */}
            <StatsItem>1500 followers</StatsItem>
            <StatsItem isSeparator>{` \u2022 `}</StatsItem>
            <StatsItem>31 posts</StatsItem>
          </StatsWrapper>
        </ItemText>
        {this.renderButtons(isSubscribed)}
      </Item>
    );
  }
}
