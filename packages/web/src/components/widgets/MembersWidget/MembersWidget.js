/* eslint-disable class-methods-use-this,no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { InvisibleText } from '@commun/ui';

import { displaySuccess, displayError } from 'utils/toastsMessages';
import { communityType } from 'types';
import { fetchCommunityMembersWidgetIfEmpty } from 'store/actions/complex';

import Avatar from 'components/common/Avatar';
import { CommunityLink, ProfileLink } from 'components/links';
import SeeAll from 'components/common/SeeAll';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import AsyncAction from 'components/common/AsyncAction';

import {
  WidgetCard,
  WidgetHeader,
  WidgetList,
  WidgetItem,
  WidgetItemText,
  WidgetNameLink,
  StatsWrapper,
  StatsItem,
  ButtonsWrapper,
  FollowButton,
  MoreActions,
  MoreIcon,
} from '../common';

const ITEMS_LIMIT = 5;

export default class MembersWidget extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    community: communityType.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        username: PropTypes.string.isRequired,
        name: PropTypes.string,
      })
    ).isRequired,
    currentUserId: PropTypes.string,
    currentUserSubscriptions: PropTypes.arrayOf(PropTypes.string).isRequired,

    fetchCommunityMembersWidgetIfEmpty: PropTypes.func.isRequired,
    pin: PropTypes.func.isRequired,
    unpin: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentUserId: null,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    const { communityId } = parentInitialProps;

    try {
      await store.dispatch(
        fetchCommunityMembersWidgetIfEmpty({
          communityId,
          limit: ITEMS_LIMIT,
        })
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('fetchCommunityMembersWidget failed:', err);
    }
  }

  componentDidMount() {
    const { communityId, fetchCommunityMembersWidgetIfEmpty } = this.props;

    fetchCommunityMembersWidgetIfEmpty({
      communityId,
      limit: ITEMS_LIMIT,
    });
  }

  onClickToggleFollow = async (userId, isSubscribed) => {
    const { pin, unpin } = this.props;

    try {
      if (isSubscribed) {
        await unpin(userId);
        displaySuccess('User unfollowed');
      } else {
        await pin(userId);
        displaySuccess('User followed');
      }
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return;
      }
      displayError(err);
    }
  };

  renderButtons(userId) {
    const { currentUserId, currentUserSubscriptions } = this.props;
    const isSubscribed = currentUserSubscriptions.includes(userId);
    const text = isSubscribed ? 'Unfollow' : 'Follow';
    const isOwnerUser = currentUserId === userId;

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
              <MoreIcon />
              <InvisibleText>More</InvisibleText>
            </MoreActions>
          )}
          items={() => (
            <DropDownMenuItem
              name="profile-followers__unsubscribe"
              onClick={() => this.onClickToggleFollow(userId, isSubscribed)}
            >
              {text}
            </DropDownMenuItem>
          )}
        />
      );
    }

    return (
      <AsyncAction onClickHandler={() => this.onClickToggleFollow(userId, isSubscribed)}>
        <FollowButton name="profile-followers__subscribe" title={text}>
          {text}
        </FollowButton>
      </AsyncAction>
    );
  }

  render() {
    const { items, community } = this.props;

    if (!items.length) {
      return null;
    }

    return (
      <WidgetCard>
        <WidgetHeader
          title="Members"
          count={community.subscribersCount}
          right={
            <CommunityLink community={community} section="members">
              <SeeAll />
            </CommunityLink>
          }
        />
        <WidgetList>
          {items.map(({ userId, username, subscribersCount, postsCount }) => (
            <WidgetItem key={userId}>
              <Avatar userId={userId} useLink />
              <WidgetItemText>
                <ProfileLink user={username}>
                  <WidgetNameLink>{username}</WidgetNameLink>
                </ProfileLink>
                <StatsWrapper>
                  <StatsItem>{`${subscribersCount || 0} followers`}</StatsItem>
                  <StatsItem isSeparator>{` \u2022 `}</StatsItem>
                  <StatsItem>{`${postsCount || 0} posts`}</StatsItem>
                </StatsWrapper>
              </WidgetItemText>
              <ButtonsWrapper>{this.renderButtons(userId)}</ButtonsWrapper>
            </WidgetItem>
          ))}
        </WidgetList>
      </WidgetCard>
    );
  }
}
