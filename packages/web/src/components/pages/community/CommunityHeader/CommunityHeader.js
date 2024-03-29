/* eslint-disable no-alert */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { InvisibleText, up } from '@commun/ui';

import { communityType } from 'types/common';
import { MAX_COMMUNITY_NAME_LENGTH } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { formatNumber } from 'utils/format';
import { smartTrim } from 'utils/text';
import { displayError, displaySuccess } from 'utils/toastsMessages';

import AsyncAction from 'components/common/AsyncAction';
import Avatar from 'components/common/Avatar';
import CoverImage from 'components/common/CoverImage';
import { DropDownMenuItem } from 'components/common/DropDownMenu';
import {
  ActionsWrapper,
  ContentWrapper,
  CounterField,
  CounterName,
  CountersLeft,
  CountersWrapper,
  CounterValue,
  CoverAvatar,
  DropDownMenu,
  FollowButton,
  InfoContainer,
  InfoWrapper,
  JoinedDate,
  MoreActions,
  Name,
  NameWrapper,
  Wrapper,
} from 'components/common/EntityHeader';

const ActionsWrapperStyled = styled(ActionsWrapper)`
  ${up.tablet} {
    & > :not(:last-child) {
      margin-right: 5px;
    }
  }
`;

// const NotificationsButton = styled.button.attrs({ type: 'button' })`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 34px;
//   height: 34px;
//   border-radius: 48px;
//   color: ${({ theme }) => theme.colors.blue};
//   background-color: ${({ theme }) => theme.colors.lightGrayBlue};
//   transition: color 0.15s;
//
//   &:hover,
//   &:focus {
//     color: ${({ theme }) => theme.colors.blueHover};
//   }
// `;

const MoreActionsStyled = styled(MoreActions)`
  ${is('isMobile')`
    display: flex;

    ${up.tablet} {
      display: none;
    }
  `};
`;

const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;
`;

const FriendsRow = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-right: 4px;
`;

const AvatarStyled = styled(Avatar)`
  width: 30px;
  height: 30px;
  margin-right: -8px;
  border: 2px solid #fff;
`;

@withTranslation()
export default class CommunityHeader extends PureComponent {
  static propTypes = {
    community: communityType.isRequired,
    currentUserId: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
    isDesktop: PropTypes.bool.isRequired,
    isLeader: PropTypes.bool.isRequired,

    joinCommunity: PropTypes.func.isRequired,
    leaveCommunity: PropTypes.func.isRequired,
    blockCommunity: PropTypes.func.isRequired,
    unblockCommunity: PropTypes.func.isRequired,
    setCommunityInfo: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    fetchCommunity: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentUserId: null,
  };

  onSubscribeClick = async () => {
    const { community, joinCommunity, t } = this.props;

    try {
      await joinCommunity(community.id);
      displaySuccess(t('toastsMessages.community.followed'));
    } catch (err) {
      displayError(err);
    }
  };

  onUnsubscribeClick = async () => {
    const { community, leaveCommunity, t } = this.props;

    try {
      await leaveCommunity(community.id);
      displaySuccess(t('toastsMessages.community.unfollowed'));
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return;
      }
      displayError(err);
    }
  };

  onBlockClick = async () => {
    const { community, blockCommunity, waitForTransaction, fetchCommunity, t } = this.props;

    try {
      const result = await blockCommunity(community.id);
      await waitForTransaction(result.transaction_id);
      await fetchCommunity({ communityId: community.id });
      displaySuccess(t('toastsMessages.success'));
    } catch (err) {
      displayError(err);
    }
  };

  onUnblockClick = async () => {
    const { community, unblockCommunity, waitForTransaction, fetchCommunity, t } = this.props;

    try {
      const result = await unblockCommunity(community.id);
      await waitForTransaction(result.transaction_id);
      await fetchCommunity({ communityId: community.id });
      displaySuccess(t('toastsMessages.success'));
    } catch (err) {
      displayError(err);
    }
  };

  onNotificationsClick = () => {
    // TODO: onNotificationsClick handler
  };

  onAvatarUpdate = async url => {
    const { community, setCommunityInfo } = this.props;

    await setCommunityInfo({
      communityId: community.id,
      updates: {
        avatarUrl: url,
      },
    });
  };

  onCoverUpdate = async url => {
    const { community, setCommunityInfo } = this.props;

    await setCommunityInfo({
      communityId: community.id,
      updates: {
        coverUrl: url,
      },
    });
  };

  renderCommunityName() {
    const { community, isDesktop } = this.props;
    const { name } = community;

    if (isDesktop) {
      return (
        <Name aria-label={name.length > MAX_COMMUNITY_NAME_LENGTH ? name : null}>
          {smartTrim(name, MAX_COMMUNITY_NAME_LENGTH)}
        </Name>
      );
    }

    return <Name>{name}</Name>;
  }

  renderDropDownMenu = (isMobile, isInBlacklist) => {
    const { t } = this.props;

    return (
      <DropDownMenu
        align="right"
        openAt="bottom"
        isMobile={isMobile}
        handler={props => (
          <MoreActionsStyled {...props} name="community-header__more-actions" isMobile={isMobile}>
            <IconStyled name="more" />
            <InvisibleText>{t('common.more')}</InvisibleText>
          </MoreActionsStyled>
        )}
        items={() => (
          <DropDownMenuItem
            name={
              isInBlacklist
                ? 'community-header__unblock-community'
                : 'community-header__block-community'
            }
            onClick={isInBlacklist ? this.onUnblockClick : this.onBlockClick}
          >
            {isInBlacklist ? t('common.unblock') : t('common.block')}
          </DropDownMenuItem>
        )}
      />
    );
  };

  renderCounters() {
    const { community, currentUserId, t } = this.props;

    return (
      <CountersWrapper>
        <CountersLeft>
          <CounterField>
            <CounterValue>{community.leadersCount}</CounterValue>
            &nbsp;
            <CounterName>
              {t('common.counters.leader', { count: community.leadersCount })}&nbsp;•&nbsp;
            </CounterName>
          </CounterField>
          <CounterField>
            <CounterValue>{formatNumber(community.subscribersCount)}</CounterValue>
            &nbsp;
            <CounterName>
              {t('common.counters.member', { count: community.subscribersCount })}
            </CounterName>
          </CounterField>
        </CountersLeft>
        {currentUserId && community.friends ? (
          <>
            <FriendsRow>
              {community.friends.slice(0, 3).map(userId => (
                <AvatarStyled key={userId} userId={userId} useLink />
              ))}
            </FriendsRow>
            {community.friendsCount > 3 ? (
              <CounterField>
                <CounterValue>&nbsp;+&nbsp;{community.friendsCount - 3}</CounterValue>
                &nbsp;
                <CounterName>
                  {t('common.counters.friend', { count: community.friendsCount })}
                </CounterName>
              </CounterField>
            ) : null}
          </>
        ) : null}
      </CountersWrapper>
    );
  }

  render() {
    const { community, isLeader, isMobile, t } = this.props;
    const { id, registrationTime, isSubscribed, isInBlacklist } = community;

    return (
      <Wrapper>
        <CoverImage
          communityId={id}
          editable={isLeader}
          successMessage={t('modals.cover_image.toastsMessages.proposal_created')}
          onUpdate={this.onCoverUpdate}
        />
        {this.renderDropDownMenu(true, isInBlacklist)}
        <ContentWrapper>
          <InfoWrapper>
            <CoverAvatar
              isCommunity
              communityId={id}
              successMessage={t('modals.cover_avatar.toastsMessages.proposal_created')}
              editable={isLeader}
              onUpdate={this.onAvatarUpdate}
            />
            <InfoContainer>
              <NameWrapper>
                {this.renderCommunityName()}
                <JoinedDate>
                  {t('components.community.community_header.created', {
                    date: dayjs(registrationTime).format('MMMM D, YYYY'),
                  })}
                </JoinedDate>
              </NameWrapper>
            </InfoContainer>
            <ActionsWrapperStyled>
              {/* {isSubscribed ? ( */}
              {/*  <NotificationsButton onClick={this.onNotificationsClick}> */}
              {/*    <Icon name="notifications" size={20} /> */}
              {/*  </NotificationsButton> */}
              {/* ) : null} */}
              <AsyncAction
                onClickHandler={isSubscribed ? this.onUnsubscribeClick : this.onSubscribeClick}
              >
                <FollowButton
                  name={
                    isSubscribed ? 'community-header__unsubscribe' : 'community-header__subscribe'
                  }
                  primary={!isSubscribed}
                >
                  {isSubscribed ? t('common.unfollow') : t('common.follow')}
                </FollowButton>
              </AsyncAction>
              {this.renderDropDownMenu(false, isInBlacklist)}
            </ActionsWrapperStyled>
          </InfoWrapper>
          {isMobile ? this.renderCounters() : null}
        </ContentWrapper>
      </Wrapper>
    );
  }
}
