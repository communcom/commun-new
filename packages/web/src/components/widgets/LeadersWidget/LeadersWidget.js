/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { InvisibleText } from '@commun/ui';

import { displaySuccess, displayError } from 'utils/toastsMessages';
import { communityType } from 'types';
import { fetchLeadersWidgetIfEmpty } from 'store/actions/complex';

import { CommunityLink, ProfileLink } from 'components/links';
import Avatar from 'components/common/Avatar';
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

export default class LeadersWidget extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        username: PropTypes.string,
        avatarUrl: PropTypes.string,
        rating: PropTypes.string.isRequired,
      })
    ).isRequired,
    community: communityType.isRequired,
    currentUserId: PropTypes.string,
    currentUserSubscriptions: PropTypes.arrayOf(PropTypes.string).isRequired,

    fetchLeadersWidgetIfEmpty: PropTypes.func.isRequired,
    pin: PropTypes.func.isRequired,
    unpin: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentUserId: null,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    const { communityId } = parentInitialProps;

    try {
      await store.dispatch(fetchLeadersWidgetIfEmpty({ communityId, limit: ITEMS_LIMIT }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('fetchLeadersWidget failed:', err);
    }
  }

  componentDidMount() {
    const { communityId, fetchLeadersWidgetIfEmpty } = this.props;

    fetchLeadersWidgetIfEmpty({
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

    return (
      <WidgetCard>
        <WidgetHeader
          title="Leaders"
          count={items.length}
          link={
            <CommunityLink community={community} section="leaders">
              <SeeAll />
            </CommunityLink>
          }
        />
        <WidgetList>
          {items.map(({ userId, username }) => (
            <WidgetItem key={userId}>
              <Avatar userId={userId} useLink />
              <WidgetItemText>
                <ProfileLink user={username}>
                  <WidgetNameLink>{username}</WidgetNameLink>
                </ProfileLink>
                <StatsWrapper>
                  {/* TODO: should be replaced with real data when backend will be ready */}
                  <StatsItem isBlue>Owner</StatsItem>
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
