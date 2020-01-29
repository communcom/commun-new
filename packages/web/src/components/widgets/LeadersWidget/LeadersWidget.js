/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { InvisibleText } from '@commun/ui';
import { displaySuccess, displayError } from 'utils/toastsMessages';
import { communityType } from 'types';
import { fetchLeadersWidgetIfEmpty } from 'store/actions/complex';

import { CommunityLink, ProfileLink } from 'components/links';
import LeaderAvatar from 'components/common/LeaderAvatar';
import SeeAll from 'components/common/SeeAll';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import AsyncAction from 'components/common/AsyncAction';
import AsyncButton from 'components/common/AsyncButton';

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

const LeaderAvatarStyled = styled(LeaderAvatar)`
  width: 44px;
  height: 44px;

  .leaders-avatar__rating {
    width: 44px;
    height: 44px;

    svg {
      width: 100%;
      height: 100%;
    }
  }
`;

const ButtonStyled = styled(AsyncButton).attrs({ primary: true })`
  width: 100%;
  height: 38px;
  margin-top: 20px;
`;

const ITEMS_LIMIT = 5;

export default class LeadersWidget extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        username: PropTypes.string,
        avatarUrl: PropTypes.string,
        rating: PropTypes.number.isRequired,
      })
    ),
    community: communityType.isRequired,
    currentUserId: PropTypes.string,
    currentUserSubscriptions: PropTypes.arrayOf(PropTypes.string).isRequired,
    isLeader: PropTypes.bool,

    fetchLeadersWidgetIfEmpty: PropTypes.func.isRequired,
    pin: PropTypes.func.isRequired,
    unpin: PropTypes.func.isRequired,
    claimLeader: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentUserId: null,
    items: null,
    isLeader: false,
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

  onClickClaim = async () => {
    const { communityId, claimLeader, waitForTransaction } = this.props;

    try {
      const result = await claimLeader(communityId);
      await waitForTransaction(result.transaction_id);

      displaySuccess('Leadership payouts successfully claimed');
    } catch (err) {
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
            <MoreActions {...props} name="widget-leaders__more-actions">
              <MoreIcon />
              <InvisibleText>More</InvisibleText>
            </MoreActions>
          )}
          items={() => (
            <DropDownMenuItem
              name="widget-leaders__unsubscribe"
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
        <FollowButton name="widget-leaders__subscribe" title={text}>
          {text}
        </FollowButton>
      </AsyncAction>
    );
  }

  render() {
    const { items, community, isLeader } = this.props;

    if (!items) {
      return null;
    }

    return (
      <WidgetCard>
        <WidgetHeader
          title="Leaders"
          count={items.length}
          right={
            <CommunityLink community={community} section="leaders">
              <SeeAll />
            </CommunityLink>
          }
        />
        <WidgetList>
          {items.map(({ userId, username, rating, ratingPercent }) => (
            <WidgetItem key={userId}>
              <LeaderAvatarStyled userId={userId} percent={ratingPercent} useLink avatarSize={34} />
              <WidgetItemText>
                <ProfileLink user={username}>
                  <WidgetNameLink>{username}</WidgetNameLink>
                </ProfileLink>
                <StatsWrapper>
                  <StatsItem isBlue>{rating} points</StatsItem>
                  <StatsItem isSeparator isBlue>{` \u2022 `}</StatsItem>
                  <StatsItem isBlue>{Math.round(ratingPercent * 100)}%</StatsItem>
                </StatsWrapper>
              </WidgetItemText>
              <ButtonsWrapper>{this.renderButtons(userId)}</ButtonsWrapper>
            </WidgetItem>
          ))}
        </WidgetList>
        {isLeader ? (
          <ButtonStyled onClick={this.onClickClaim}>Claim leader’s rewards</ButtonStyled>
        ) : null}
      </WidgetCard>
    );
  }
}
