/* eslint-disable no-alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { InvisibleText } from '@commun/ui';

import { communityType } from 'types/common';
import { displaySuccess, displayError } from 'utils/toastsMessages';
import { Link } from 'shared/routes';

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
          displaySuccess('Community unfollowed');
        } else {
          result = await joinCommunity(communityId, isOnboarding);
          displaySuccess('Community followed');
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
    const { community, unblockCommunity, fetchCommunity, waitForTransaction } = this.props;

    try {
      const result = await unblockCommunity(community.communityId);
      await waitForTransaction(result.transaction_id);
      await fetchCommunity({ communityId: community.communityId });
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }
  };

  renderButtons() {
    const { community, isOnboarding, isBlacklist } = this.props;
    const { isSubscribed } = community;

    const text = isSubscribed ? 'Unfollow' : 'Follow';

    if (isBlacklist) {
      return (
        <AsyncAction onClickHandler={this.onUnblockClick}>
          <UnblockButton name="blacklist__unblock" title={`Unblock ${community.name}`}>
            <UnblockIcon />
            <InvisibleText>Unblock {community.alias}</InvisibleText>
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
              <InvisibleText>More</InvisibleText>
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
          <FollowButton isJoined name="profile-communities__join" title={text}>
            Unfollow
          </FollowButton>
        </AsyncAction>
      );
    }

    return (
      <AsyncAction onClickHandler={this.onClickToggleFollow}>
        <FollowButton name="profile-communities__join" title={text}>
          {text}
        </FollowButton>
      </AsyncAction>
    );
  }

  render() {
    const { community, isOnboarding, isBlacklist, className } = this.props;
    const { communityId, alias, name, subscribersCount, postsCount, isSubscribed } = community;

    return (
      <Item isOnboarding={isOnboarding} className={className}>
        <AvatarStyled isOnboarding={isOnboarding} communityId={communityId} useLink />
        <ItemText isFollowed={isSubscribed} isBlacklist={isBlacklist}>
          <Link route="community" params={{ communityAlias: alias }} passHref>
            <ItemNameLink isOnboarding={isOnboarding}>{name}</ItemNameLink>
          </Link>
          <StatsWrapper isOnboarding={isOnboarding}>
            <StatsItem>{subscribersCount} followers</StatsItem>
            <StatsItem isSeparator>{` \u2022 `}</StatsItem>
            <StatsItem>{postsCount} posts</StatsItem>
          </StatsWrapper>
        </ItemText>
        {this.renderButtons()}
      </Item>
    );
  }
}
