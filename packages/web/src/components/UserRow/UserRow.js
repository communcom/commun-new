/* eslint-disable no-alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { userType } from 'types/common';
import { Link } from 'shared/routes';
import { displaySuccess, displayError } from 'utils/toastsMessages';
import { styles } from '@commun/ui';
import Avatar from 'components/Avatar/';

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
  };

  static defaultProps = {
    isOwnerUser: false,
  };

  onClickToggleFollow = async () => {
    const { user, pin, unpin } = this.props;

    try {
      if (user.hasSubscription) {
        await unpin(user.id);
        displaySuccess('User unfollowed');
      } else {
        await pin(user.id);
        displaySuccess('User followed');
      }
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return;
      }
      displayError(err);
    }
  };

  render() {
    const { user, isOwnerUser } = this.props;

    const text = user.hasSubscription ? 'Unfollow' : 'Follow';

    return (
      <Item key={user.id}>
        <AvatarStyled userId={user.id} useLink />
        <ItemText>
          <Link route="profile" params={{ userId: user.id }} passHref>
            <ItemNameLink>{user.username}</ItemNameLink>
          </Link>
          {/* <ItemFollowers>{'{FOLLOWERS_COUNT}'} followers</ItemFollowers> */}
        </ItemText>
        {!isOwnerUser ? (
          <FollowButton
            name={
              user.hasSubscription
                ? 'profile-followers__unsubscribe'
                : 'profile-followers__subscribe'
            }
            title={text}
            onClick={this.onClickToggleFollow}
            isActive={user.hasSubscription}
          >
            {text}
          </FollowButton>
        ) : null}
      </Item>
    );
  }
}
