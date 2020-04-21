import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';

import { InvisibleText } from '@commun/ui';

import { communityType } from 'types/common';
import { displaySuccess, displayError } from 'utils/toastsMessages';
import { Link } from 'shared/routes';
import { withTranslation } from 'shared/i18n';

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
} from './CommunityRow.styled';

@withTranslation()
export default class CommunityRow extends Component {
  static propTypes = {
    community: communityType.isRequired,
    isOnboarding: PropTypes.bool,
    isBlacklist: PropTypes.bool,
    isSignUp: PropTypes.bool,

    joinCommunity: PropTypes.func.isRequired,
    leaveCommunity: PropTypes.func.isRequired,
    unblockCommunity: PropTypes.func.isRequired,
    fetchCommunity: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    unauthAddCommunity: PropTypes.func.isRequired,
    unauthRemoveCommunity: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOnboarding: false,
    isBlacklist: false,
    isSignUp: false,
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
    const { community } = this.props;
    const { community: prevCommunity } = prevProps;

    if (community?.isSubscribed !== prevCommunity?.isSubscribed) {
      this.getFollowButtonWidth();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getFollowButtonWidth);

    this.getFollowButtonWidth.cancel();
  }

  onClickToggleFollow = async () => {
    const {
      community,
      unauthAddCommunity,
      unauthRemoveCommunity,
      joinCommunity,
      leaveCommunity,
      waitForTransaction,
      fetchCommunity,
      isSignUp,
      isOnboarding,
      t,
    } = this.props;
    const { communityId, isSubscribed } = community;

    try {
      if (isSignUp) {
        if (isSubscribed) {
          await unauthRemoveCommunity(communityId);
        } else {
          await unauthAddCommunity(communityId);
        }
      } else {
        let result;
        if (isSubscribed) {
          result = await leaveCommunity(communityId, isOnboarding);
          displaySuccess(t('toastsMessages.community.unfollowed'));
        } else {
          result = await joinCommunity(communityId, isOnboarding);
          displaySuccess(t('toastsMessages.community.followed'));
        }
        await waitForTransaction(result.transaction_id);
        await fetchCommunity({ communityId });
      }
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return;
      }
      displayError(err);
    }
  };

  onUnblockClick = async () => {
    const { community, unblockCommunity, fetchCommunity, waitForTransaction, t } = this.props;

    try {
      const result = await unblockCommunity(community.communityId);
      await waitForTransaction(result.transaction_id);
      await fetchCommunity({ communityId: community.communityId });
      displaySuccess(t('toastsMessages.success'));
    } catch (err) {
      displayError(err);
    }
  };

  renderButtons() {
    const { community, isOnboarding, isBlacklist, t } = this.props;
    const { isSubscribed } = community;

    const text = isSubscribed ? t('common.unfollow') : t('common.follow');

    if (isBlacklist) {
      return (
        <AsyncAction onClickHandler={this.onUnblockClick}>
          <UnblockButton
            name="blacklist__unblock"
            aria-label={`${t('common.unblock')} ${community.name}`}
          >
            <UnblockIcon />
            <InvisibleText>
              {t('common.unblock')} {community.name}
            </InvisibleText>
          </UnblockButton>
        </AsyncAction>
      );
    }

    if (isSubscribed && !isOnboarding) {
      return (
        <DropDownMenu
          align="right"
          openAt="top"
          handler={props => (
            <MoreActions {...props} name="profile-communities__more-actions">
              <MoreIcon />
              <InvisibleText>{t('common.more')}</InvisibleText>
            </MoreActions>
          )}
          items={() => (
            <DropDownMenuItem name="profile-communities__leave" onClick={this.onClickToggleFollow}>
              {text}
            </DropDownMenuItem>
          )}
        />
      );
    }

    if (isSubscribed && isOnboarding) {
      return (
        <AsyncAction onClickHandler={this.onClickToggleFollow}>
          <FollowButton
            ref={this.followButtonRef}
            isJoined
            name="profile-communities__join"
            title={text}
          >
            {t('common.unfollow')}
          </FollowButton>
        </AsyncAction>
      );
    }

    return (
      <AsyncAction onClickHandler={this.onClickToggleFollow}>
        <FollowButton ref={this.followButtonRef} name="profile-communities__join" title={text}>
          {text}
        </FollowButton>
      </AsyncAction>
    );
  }

  render() {
    const { community, isOnboarding, isBlacklist, t, className } = this.props;
    const { followButtonWidth } = this.state;
    const { communityId, alias, name, subscribersCount, postsCount, isSubscribed } = community;

    return (
      <Item isOnboarding={isOnboarding} className={className}>
        <AvatarStyled isOnboarding={isOnboarding} communityId={communityId} useLink />
        <ItemText
          followButtonWidth={followButtonWidth}
          isFollowed={isSubscribed}
          isBlacklist={isBlacklist}
          isOnboarding={isOnboarding}
        >
          <Link route="community" params={{ communityAlias: alias }} passHref>
            <ItemNameLink isOnboarding={isOnboarding}>{name}</ItemNameLink>
          </Link>
          <StatsWrapper isOnboarding={isOnboarding}>
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
