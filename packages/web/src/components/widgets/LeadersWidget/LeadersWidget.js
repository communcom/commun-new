/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { InvisibleText } from '@commun/ui';

import { communityType } from 'types';
import { withTranslation } from 'shared/i18n';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { fetchLeadersWidgetIfEmpty } from 'store/actions/complex';

import AsyncAction from 'components/common/AsyncAction';
import AsyncButton from 'components/common/AsyncButton';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import LeaderAvatar from 'components/common/LeaderAvatar';
import SeeAll from 'components/common/SeeAll';
import { CommunityLink, ProfileLink } from 'components/links';
import {
  ButtonsWrapper,
  FollowButton,
  MoreActions,
  MoreIcon,
  StatsItem,
  StatsWrapper,
  WidgetCard,
  WidgetHeader,
  WidgetItem,
  WidgetItemText,
  WidgetList,
  WidgetNameLink,
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

@withTranslation()
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
    const { pin, unpin, t } = this.props;

    try {
      if (isSubscribed) {
        await unpin(userId);
        displaySuccess(t('toastsMessages.user.unfollowed'));
      } else {
        await pin(userId);
        displaySuccess(t('toastsMessages.user.followed'));
      }
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return;
      }
      displayError(err);
    }
  };

  onClickClaim = async () => {
    const { communityId, claimLeader, waitForTransaction, t } = this.props;

    try {
      const result = await claimLeader(communityId);
      await waitForTransaction(result.transaction_id);

      displaySuccess(t('widgets.leaders.toastsMessages.claimed'));
    } catch (err) {
      displayError(err);
    }
  };

  renderButtons(userId) {
    const { currentUserId, currentUserSubscriptions, t } = this.props;
    const isSubscribed = currentUserSubscriptions.includes(userId);
    const text = isSubscribed ? t('common.unfollow') : t('common.follow');
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
              <InvisibleText>{t('common.more')}</InvisibleText>
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
    const { items, community, isLeader, t } = this.props;

    if (!items) {
      return null;
    }

    return (
      <WidgetCard>
        <WidgetHeader
          title={t('widgets.leaders.title', { count: items.length })}
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
                  <StatsItem isBlue>
                    {rating} {t('common.counters.point', { count: rating })}
                  </StatsItem>
                  <StatsItem isSeparator isBlue>{` \u2022 `}</StatsItem>
                  <StatsItem isBlue>{Math.round(ratingPercent * 100)}%</StatsItem>
                </StatsWrapper>
              </WidgetItemText>
              <ButtonsWrapper>{this.renderButtons(userId)}</ButtonsWrapper>
            </WidgetItem>
          ))}
        </WidgetList>
        {isLeader ? (
          <ButtonStyled onClick={this.onClickClaim}>{t('widgets.leaders.claim')}</ButtonStyled>
        ) : null}
      </WidgetCard>
    );
  }
}
