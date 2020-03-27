/* eslint-disable no-alert,no-console */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import dayjs from 'dayjs';

import { Button, InvisibleText, up } from '@commun/ui';
import { Icon } from '@commun/icons';
import { withTranslation } from 'shared/i18n';
import {
  SHOW_MODAL_SEND_POINTS,
  SHOW_MODAL_MOBILE_MENU,
  SHOW_MODAL_PROFILE_ABOUT_EDIT,
} from 'store/constants/modalTypes';
import { displaySuccess, displayError } from 'utils/toastsMessages';
import { profileType } from 'types/common';
import { formatNumber } from 'utils/format';

import CoverImage from 'components/common/CoverImage';
import AsyncAction from 'components/common/AsyncAction';
import { DropDownMenuItem } from 'components/common/DropDownMenu';
import { MobileBalanceWidget } from 'components/widgets';
import {
  Wrapper,
  ContentWrapper,
  InfoWrapper,
  CoverAvatar,
  ActionsWrapper,
  NameWrapper,
  InfoContainer,
  JoinedDate,
  MoreActions,
  Name,
  CountersWrapper,
  CountersLeft,
  CounterField,
  CounterValue,
  CounterName,
  DropDownMenu,
  FollowButton,
} from 'components/common/EntityHeader';
import Description from '../Description';

const ActionsWrapperStyled = styled(ActionsWrapper)`
  ${up.tablet} {
    & > :not(:last-child) {
      margin-right: 10px;
    }
  }
`;

const MoreActionsStyled = styled(MoreActions)`
  ${is('isMobile')`
    position: absolute;
    top: 28px;
    right: 16px;
    z-index: 5;
    display: flex;

    ${up.tablet} {
      display: none;
    }
  `};
`;

const MoreIcon = styled(Icon).attrs({ name: 'more' })`
  width: 24px;
  height: 24px;

  ${is('isBig')`
    width: 40px;
    height: 40px;
  `};
`;

const BalanceWidgetWrapper = styled.div`
  padding: 0 15px 25px;
`;

@withTranslation()
export default class ProfileHeader extends PureComponent {
  static propTypes = {
    loggedUserId: PropTypes.string,
    profile: profileType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,

    blockUser: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    pin: PropTypes.func.isRequired,
    unpin: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    updateProfileMeta: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
  };

  onOpenMobileMenu = () => {
    const { openModal, profile, isOwner } = this.props;

    openModal(SHOW_MODAL_MOBILE_MENU, {
      type: 'profile',
      profile,
      isOwner,
      blockUser: this.onBlockClick,
      sendPoints: this.sendPointsHandler,
      editBio: this.onEditBio,
    });
  };

  onBlockClick = async () => {
    const { profile, blockUser, fetchProfile, waitForTransaction } = this.props;

    try {
      const result = await blockUser(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }
  };

  onUnblockClick = async () => {
    const { profile, unblockUser, fetchProfile, waitForTransaction } = this.props;

    try {
      const result = await unblockUser(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }
  };

  onSubscribeClick = async () => {
    const { profile, pin, fetchProfile, waitForTransaction } = this.props;

    try {
      const result = await pin(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }
  };

  onUnsubscribeClick = async () => {
    const { profile, unpin, fetchProfile, waitForTransaction } = this.props;

    try {
      const result = await unpin(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }
  };

  onAvatarUpdate = async url => {
    const { updateProfileMeta } = this.props;

    await updateProfileMeta({
      avatarUrl: url,
    });
  };

  onCoverUpdate = async url => {
    const { updateProfileMeta } = this.props;

    await updateProfileMeta({
      coverUrl: url,
    });
  };

  sendPointsHandler = () => {
    const { openModal, profile } = this.props;
    openModal(SHOW_MODAL_SEND_POINTS, { selectedUser: profile });
  };

  onEditBio = () => {
    const { openModal, profile, isOwner } = this.props;

    if (isOwner) {
      openModal(SHOW_MODAL_PROFILE_ABOUT_EDIT, { userId: profile.userId });
    }
  };

  renderCounters() {
    const { profile, t } = this.props;

    return (
      <CountersWrapper>
        <CountersLeft>
          <CounterField>
            <CounterValue>{formatNumber(profile.subscribers.usersCount)}</CounterValue>
            &nbsp;
            <CounterName>
              {t('common.counters.follower', { count: profile.subscribers.usersCount })}
              &nbsp;•&nbsp;
            </CounterName>
          </CounterField>
          <CounterField>
            <CounterValue>{formatNumber(profile.subscriptions.usersCount)}</CounterValue>
            &nbsp;
            <CounterName>
              {t('common.counters.following', { count: profile.subscriptions.usersCount })}
              &nbsp;•&nbsp;
            </CounterName>
          </CounterField>
          <CounterField>
            <CounterValue>{formatNumber(profile.subscriptions.communitiesCount)}</CounterValue>
            &nbsp;
            <CounterName>
              {t('common.counters.community', { count: profile.subscriptions.communitiesCount })}
            </CounterName>
          </CounterField>
        </CountersLeft>
      </CountersWrapper>
    );
  }

  renderDropDownMenu = (isMobile, isInBlacklist) => {
    const { t } = this.props;

    return (
      <DropDownMenu
        align="right"
        openAt="bottom"
        isMobile={isMobile}
        handler={props => (
          <MoreActionsStyled {...props} name="profile-header__more-actions" isMobile={isMobile}>
            <MoreIcon />
            <InvisibleText>{t('common.more')}</InvisibleText>
          </MoreActionsStyled>
        )}
        items={() => (
          <DropDownMenuItem
            name={isInBlacklist ? 'profile-header__unblock-user' : 'profile-header__block-user'}
            onClick={isInBlacklist ? this.onUnblockClick : this.onBlockClick}
          >
            {isInBlacklist ? t('common.unblock') : t('common.block')}
          </DropDownMenuItem>
        )}
      />
    );
  };

  render() {
    const { isOwner, profile, loggedUserId, isMobile, t } = this.props;
    const { userId, username, isInBlacklist } = profile;
    const isSubscribed = profile.isSubscribed || false;

    return (
      <Wrapper>
        <CoverImage
          userId={userId}
          editable={isOwner}
          successMessage={t('components.profile.profile_header.cover_updated')}
          onUpdate={this.onCoverUpdate}
        />
        {loggedUserId ? (
          <MoreActionsStyled
            isMobile
            name="profile-header__more-actions"
            onClick={this.onOpenMobileMenu}
          >
            <MoreIcon />
            <InvisibleText>{t('common.more')}</InvisibleText>
          </MoreActionsStyled>
        ) : null}
        <ContentWrapper>
          <InfoWrapper>
            <CoverAvatar
              userId={userId}
              editable={isOwner}
              successMessage={t('components.profile.profile_header.avatar_updated')}
              onUpdate={this.onAvatarUpdate}
            />
            <InfoContainer>
              <NameWrapper>
                <Name>{username}</Name>
                <JoinedDate>
                  {t('components.profile.profile_header.joined')}{' '}
                  {profile
                    ? dayjs(profile.registration.time).format('MMMM D, YYYY')
                    : `{${t('components.profile.profile_header.not_available')}}`}
                </JoinedDate>
              </NameWrapper>
              {isMobile ? null : <Description profile={profile} isOwner={isOwner} isCompact />}
            </InfoContainer>
            {!isOwner && loggedUserId ? (
              <ActionsWrapperStyled>
                <AsyncAction
                  onClickHandler={isSubscribed ? this.onUnsubscribeClick : this.onSubscribeClick}
                >
                  <FollowButton
                    primary={!isSubscribed}
                    name={isSubscribed ? 'profile-header__unfollow' : 'profile-header__follow'}
                  >
                    {isSubscribed ? t('common.follow') : t('common.following')}
                  </FollowButton>
                </AsyncAction>
                {!isMobile ? (
                  <Button
                    primary
                    name="profile-header__send-points"
                    onClick={this.sendPointsHandler}
                  >
                    {t('components.profile.profile_header.send_points')}
                  </Button>
                ) : null}
                {this.renderDropDownMenu(false, isInBlacklist)}
              </ActionsWrapperStyled>
            ) : null}
          </InfoWrapper>
          {isMobile ? (
            <>
              <Description profile={profile} isOwner={isOwner} isCompact isMobile />
              {loggedUserId === profile.userId ? (
                <BalanceWidgetWrapper>
                  <MobileBalanceWidget />
                </BalanceWidgetWrapper>
              ) : null}
              {this.renderCounters()}
            </>
          ) : null}
        </ContentWrapper>
      </Wrapper>
    );
  }
}
