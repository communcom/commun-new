import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';

import { InvisibleText } from '@commun/ui';

import { userType } from 'types/common';
import { withTranslation } from 'shared/i18n';
import { displayError, displaySuccess } from 'utils/toastsMessages';

import AsyncAction from 'components/common/AsyncAction';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import { ProfileLink } from 'components/links';
import {
  AvatarStyled,
  FollowButton,
  Item,
  ItemNameLink,
  ItemText,
  MoreActions,
  MoreIcon,
  StatsItem,
  StatsWrapper,
  UnblockButton,
  UnblockIcon,
} from './UserRow.styled';

@withTranslation()
export default class UserRow extends Component {
  static propTypes = {
    communityId: PropTypes.string,
    user: userType.isRequired,
    isOwnerUser: PropTypes.bool,
    isBlacklist: PropTypes.bool,
    isLeaderboard: PropTypes.bool,
    isProposal: PropTypes.bool,

    pin: PropTypes.func.isRequired,
    unpin: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    openBanCommunityUserModal: PropTypes.func.isRequired,
    openUnbanCommunityUserModal: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    communityId: undefined,
    isOwnerUser: false,
    isBlacklist: false,
    isLeaderboard: false,
    isProposal: false,
  };

  state = {
    followButtonWidth: 100,
  };

  followButtonRef = createRef();

  getFollowButtonWidth = throttle(() => {
    if (this.followButtonRef.current) {
      this.setState({
        followButtonWidth: this.followButtonRef.current.offsetWidth,
      });
    }
  }, 500);

  componentDidMount() {
    this.getFollowButtonWidth();

    window.addEventListener('resize', this.getFollowButtonWidth);
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props;
    const { user: prevUser } = prevProps;

    if (user?.isSubscribed !== prevUser?.isSubscribed) {
      this.getFollowButtonWidth();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getFollowButtonWidth);

    this.getFollowButtonWidth.cancel();
  }

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

  onBanClick = async () => {
    const { communityId, user, openBanCommunityUserModal } = this.props;

    openBanCommunityUserModal({
      communityId,
      userId: user.userId,
    });
  };

  onUnbanClick = async () => {
    const { communityId, user, openUnbanCommunityUserModal } = this.props;

    openUnbanCommunityUserModal({
      communityId,
      userId: user.userId,
    });
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

  renderButtons() {
    const { user, isOwnerUser, isProposal, isBlacklist, isLeaderboard, t } = this.props;
    const { isSubscribed } = user;
    const text = isSubscribed ? t('common.unfollow') : t('common.follow');

    if (isOwnerUser || isProposal) {
      return null;
    }

    if (isLeaderboard) {
      if (isBlacklist) {
        return (
          <AsyncAction onClickHandler={this.onUnbanClick}>
            <UnblockButton name="users__unban" aria-label={`${t('common.unban')} ${user.username}`}>
              <UnblockIcon />
              <InvisibleText>
                {t('common.unban')} {user.username}
              </InvisibleText>
            </UnblockButton>
          </AsyncAction>
        );
      }

      return (
        <DropDownMenu
          align="right"
          openAt="top"
          handler={props => (
            <MoreActions {...props} name="users__more-actions">
              <MoreIcon />
              <InvisibleText>{t('common.more')}</InvisibleText>
            </MoreActions>
          )}
          items={() => (
            <DropDownMenuItem name="users__ban" onClick={this.onBanClick}>
              {t('common.ban')}
            </DropDownMenuItem>
          )}
        />
      );
    }

    if (isBlacklist) {
      return (
        <AsyncAction onClickHandler={this.onUnblockClick}>
          <UnblockButton
            name="users__unblock"
            aria-label={`${t('common.unblock')} ${user.username}`}
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
            <MoreActions {...props} name="users__more-actions">
              <MoreIcon />
              <InvisibleText>{t('common.more')}</InvisibleText>
            </MoreActions>
          )}
          items={() => (
            <DropDownMenuItem name="users__unsubscribe" onClick={this.onClickToggleFollow}>
              {text}
            </DropDownMenuItem>
          )}
        />
      );
    }

    return (
      <AsyncAction onClickHandler={this.onClickToggleFollow}>
        <FollowButton ref={this.followButtonRef} name="users__subscribe" title={text}>
          {text}
        </FollowButton>
      </AsyncAction>
    );
  }

  render() {
    const { user, isBlacklist, isLeaderboard, isProposal, t, className } = this.props;
    const { followButtonWidth } = this.state;
    const { userId, username, isSubscribed, postsCount, subscribersCount } = user;

    return (
      <Item className={className}>
        <AvatarStyled userId={userId} useLink />
        <ItemText
          followButtonWidth={followButtonWidth}
          isFollowed={isSubscribed}
          isBlacklist={isBlacklist}
          isLeaderboard={isLeaderboard}
          isProposal={isProposal}
        >
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
        {this.renderButtons()}
      </Item>
    );
  }
}
