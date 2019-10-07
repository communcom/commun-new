/* eslint-disable no-alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { userType } from 'types/common';
import { displaySuccess, displayError } from 'utils/toastsMessages';
import { styles } from '@commun/ui';
import Avatar from 'components/Avatar';
import { ProfileLink } from 'components/links';

const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 0;
`;

const ItemText = styled.div`
  flex-grow: 1;
  margin-left: 16px;
`;

const ItemNameLink = styled.a`
  display: block;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.3px;
  ${styles.overflowEllipsis};
  color: #000;
`;

const FollowButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  font-size: 13px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.contextBlue};
  cursor: pointer;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.hoverBlack};
  }

  ${is('isActive')`
    color: ${({ theme }) => theme.colors.contextGrey};
  `};
`;

const AvatarStyled = styled(Avatar)`
  width: 56px;
  height: 56px;
`;

// const ItemFollowers = styled.div`
//   margin-top: 2px;
//   font-size: 15px;
//   letter-spacing: -0.3px;
//   color: ${({ theme }) => theme.colors.contextGrey};
// `;

export default class UserRow extends Component {
  static propTypes = {
    user: userType.isRequired,
    isOwnerUser: PropTypes.bool,
    pin: PropTypes.func.isRequired,
    unpin: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
  };

  static defaultProps = {
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
      await fetchProfile(userId);
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return;
      }
      displayError(err);
    }
  };

  render() {
    const { user, isOwnerUser } = this.props;
    const { userId, username, isSubscribed } = user;

    const text = isSubscribed ? 'Unfollow' : 'Follow';

    return (
      <Item key={userId}>
        <AvatarStyled userId={userId} useLink />
        <ItemText>
          <ProfileLink user={user}>
            <ItemNameLink>{username}</ItemNameLink>
          </ProfileLink>
          {/* <ItemFollowers>{'{FOLLOWERS_COUNT}'} followers</ItemFollowers> */}
        </ItemText>
        {!isOwnerUser ? (
          <FollowButton
            name={isSubscribed ? 'profile-followers__unsubscribe' : 'profile-followers__subscribe'}
            title={text}
            onClick={this.onClickToggleFollow}
            isActive={isSubscribed}
          >
            {text}
          </FollowButton>
        ) : null}
      </Item>
    );
  }
}
