/* eslint-disable no-alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { styles, up, InvisibleText } from '@commun/ui';
import { Icon } from '@commun/icons';
import { userType } from 'types/common';
import { displaySuccess, displayError } from 'utils/toastsMessages';

import Avatar from 'components/common/Avatar';
import { ProfileLink } from 'components/links';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';

const Item = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ItemText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  margin-left: 10px;
  margin-top: -6px;
`;

const ItemNameLink = styled.a`
  display: block;
  margin-bottom: 2px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  ${styles.overflowEllipsis};
  color: #000;

  ${up.desktop} {
    font-size: 16px;
    line-height: 22px;
  }
`;

const StatsWrapper = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const StatsItem = styled.p`
  text-transform: capitalize;
  ${styles.overflowEllipsis};

  ${is('isSeparator')`
    padding: 0 5px;
  `}
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
`;

const FollowButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 14px 7px;
  margin-right: 10px;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.colors.contextBlue};
  color: #fff;
  transition: background-color 0.15s;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;

const AvatarStyled = styled(Avatar)`
  width: 40px;
  height: 40px;

  ${up.desktop} {
    width: 60px;
    height: 60px;
  }
`;

const MoreActions = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 48px;
  color: ${({ theme }) => theme.colors.contextGrey};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;

const MoreIcon = styled(Icon).attrs({ name: 'more' })`
  width: 20px;
  height: 20px;

  ${is('isBig')`
    width: 40px;
    height: 40px;
  `};
`;

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
