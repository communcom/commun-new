/* eslint-disable class-methods-use-this,no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { InvisibleText } from '@commun/ui';

import { communityType } from 'types';
import { withTranslation } from 'shared/i18n';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { fetchCommunityMembersWidgetIfEmpty } from 'store/actions/complex';

import AsyncAction from 'components/common/AsyncAction';
import Avatar from 'components/common/Avatar';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
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

const ITEMS_LIMIT = 5;

@withTranslation()
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
            <MoreActions {...props} name="profile-followers__more-actions">
              <MoreIcon />
              <InvisibleText>{t('common.more')}</InvisibleText>
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
    const { items, community, t } = this.props;

    if (!items.length) {
      return null;
    }

    return (
      <WidgetCard>
        <WidgetHeader
          title={t('widgets.members.title', { count: community.subscribersCount })}
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
                  <StatsItem>
                    {subscribersCount} {t('common.counters.follower', { count: subscribersCount })}
                  </StatsItem>
                  <StatsItem isSeparator>{` \u2022 `}</StatsItem>
                  <StatsItem>
                    {postsCount} {t('common.counters.post', { count: postsCount })}
                  </StatsItem>
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
