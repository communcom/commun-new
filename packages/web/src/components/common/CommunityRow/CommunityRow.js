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

    joinCommunity: PropTypes.func.isRequired,
    leaveCommunity: PropTypes.func.isRequired,
    fetchCommunity: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
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
        displaySuccess('User unfollowed');
      } else {
        result = await joinCommunity(communityId);
        displaySuccess('User followed');
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
    const { community } = this.props;
    const { isSubscribed } = community;

    const text = isSubscribed ? 'Leave' : 'Join';

    if (isSubscribed) {
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

    return (
      <AsyncAction onClickHandler={this.onClickToggleFollow}>
        <FollowButton name="profile-communities__join" title={text}>
          {text}
        </FollowButton>
      </AsyncAction>
    );
  }

  render() {
    const { community, className } = this.props;
    const { communityId, alias, name, subscribersCount, postsCount } = community;

    return (
      <Item className={className}>
        <AvatarStyled communityId={communityId} useLink />
        <ItemText>
          <Link route="community" params={{ communityAlias: alias }} passHref>
            <ItemNameLink>{name}</ItemNameLink>
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
