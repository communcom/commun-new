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
} from './CommunityRow.styled';

export default class CommunityRow extends Component {
  static propTypes = {
    community: communityType.isRequired,
    isOnboarding: PropTypes.bool,

    joinCommunity: PropTypes.func.isRequired,
    leaveCommunity: PropTypes.func.isRequired,
    fetchCommunity: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOnboarding: false,
  };

  onClickToggleFollow = async () => {
    const {
      community,
      joinCommunity,
      leaveCommunity,
      waitForTransaction,
      fetchCommunity,
    } = this.props;
    const { communityId, isSubscribed } = community;

    try {
      let result;
      if (isSubscribed) {
        result = await leaveCommunity(communityId);
        displaySuccess('Community unfollowed');
      } else {
        result = await joinCommunity(communityId);
        displaySuccess('Community followed');
      }
      await waitForTransaction(result.transaction_id);
      await fetchCommunity({ communityId });
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return;
      }
      displayError(err);
    }
  };

  renderButtons() {
    const { community, isOnboarding } = this.props;
    const { isSubscribed } = community;

    const text = isSubscribed ? 'Unfollow' : 'Follow';

    if (isSubscribed && !isOnboarding) {
      return (
        <DropDownMenu
          align="right"
          openAt="bottom"
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
    const { community, isOnboarding, className } = this.props;
    const { communityId, alias, name, subscribersCount, postsCount } = community;

    return (
      <Item className={className}>
        <AvatarStyled isOnboarding={isOnboarding} communityId={communityId} useLink />
        <ItemText>
          <Link route="community" params={{ communityAlias: alias }} passHref>
            <ItemNameLink isOnboarding={isOnboarding}>{name}</ItemNameLink>
          </Link>
          <StatsWrapper>
            {/* TODO: should be replaced with real data when backend will be ready */}
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
