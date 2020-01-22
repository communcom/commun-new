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
    const { profile } = this.props;

    return (
      <CountersWrapper>
        <CountersLeft>
          <CounterField>
            <CounterValue>{formatNumber(profile.subscribers.usersCount)}</CounterValue>
            &nbsp;
            <CounterName>Followers&nbsp;•&nbsp;</CounterName>
          </CounterField>
          <CounterField>
            <CounterValue>{formatNumber(profile.subscriptions.usersCount)}</CounterValue>
            &nbsp;
            <CounterName>Following&nbsp;•&nbsp;</CounterName>
          </CounterField>
          <CounterField>
            <CounterValue>{formatNumber(profile.subscriptions.communitiesCount)}</CounterValue>
            &nbsp;
            <CounterName>Communities</CounterName>
          </CounterField>
        </CountersLeft>
      </CountersWrapper>
    );
  }

  renderDropDownMenu = (isMobile, isInBlacklist) => (
    <DropDownMenu
      align="right"
      openAt="bottom"
      isMobile={isMobile}
      handler={props => (
        <MoreActionsStyled {...props} name="profile-header__more-actions" isMobile={isMobile}>
          <MoreIcon />
          <InvisibleText>More</InvisibleText>
        </MoreActionsStyled>
      )}
      items={() => (
        <DropDownMenuItem
          name={isInBlacklist ? 'profile-header__unblock-user' : 'profile-header__block-user'}
          onClick={isInBlacklist ? this.onUnblockClick : this.onBlockClick}
        >
          {isInBlacklist ? 'Unblock' : 'Block'}
        </DropDownMenuItem>
      )}
    />
  );

  render() {
    const { isOwner, profile, loggedUserId, isMobile } = this.props;
    const { userId, username, isInBlacklist } = profile;
    const isSubscribed = profile.isSubscribed || false;

    return (
      <Wrapper>
        <CoverImage
          userId={userId}
          editable={isOwner}
          successMessage="Cover image updated"
          onUpdate={this.onCoverUpdate}
        />
        {loggedUserId ? (
          <MoreActionsStyled
            isMobile
            name="profile-header__more-actions"
            onClick={this.onOpenMobileMenu}
          >
            <MoreIcon />
            <InvisibleText>More</InvisibleText>
          </MoreActionsStyled>
        ) : null}
        <ContentWrapper>
          <InfoWrapper>
            <CoverAvatar
              userId={userId}
              editable={isOwner}
              successMessage="Avatar updated"
              onUpdate={this.onAvatarUpdate}
            />
            <InfoContainer>
              <NameWrapper>
                <Name>{username}</Name>
                <JoinedDate>
                  Joined{' '}
                  {profile
                    ? dayjs(profile.registration.time).format('MMMM D, YYYY')
                    : '{Profile is not available}'}
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
                    {`Follow${isSubscribed ? 'ing' : ''}`}
                  </FollowButton>
                </AsyncAction>
                {!isMobile ? (
                  <Button
                    primary
                    name="profile-header__send-points"
                    onClick={this.sendPointsHandler}
                  >
                    Send points
                  </Button>
                ) : null}
                {this.renderDropDownMenu(false, isInBlacklist)}
              </ActionsWrapperStyled>
            ) : null}
          </InfoWrapper>
          {isMobile ? (
            <>
              <Description profile={profile} isOwner={isOwner} isCompact isMobile />
              {this.renderCounters()}
            </>
          ) : null}
        </ContentWrapper>
      </Wrapper>
    );
  }
}
