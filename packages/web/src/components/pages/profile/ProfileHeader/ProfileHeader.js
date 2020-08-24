/* eslint-disable no-alert,no-console */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Button, InvisibleText, up } from '@commun/ui';

import { profileType } from 'types/common';
import { SOCIAL_MESSENGERS_LIST } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { formatNumber } from 'utils/format';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import {
  SHOW_MODAL_MOBILE_CONTACTS,
  SHOW_MODAL_MOBILE_MENU,
  SHOW_MODAL_PROFILE_ABOUT_EDIT,
  SHOW_MODAL_SEND_POINTS,
} from 'store/constants/modalTypes';

import AsyncAction from 'components/common/AsyncAction';
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
  DropDownMenuContacts,
  FollowButton,
  InfoContainer,
  InfoWrapper,
  InfoWrapperMobile,
  JoinedDate,
  MoreActions,
  Name,
  NameWrapper,
  WebsiteField,
  WebsiteLink,
  Wrapper,
} from 'components/common/EntityHeader';
import { ProfileLink } from 'components/links';
import { MobileBalanceWidget } from 'components/widgets';
import Description from '../Description';

const Username = styled.a`
  vertical-align: bottom;
`;

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
`;

const MoreIconMobile = styled(MoreIcon)`
  margin-left: 3px;
`;

const ButtonStyled = styled(Button)`
  display: flex;
  align-items: center;

  ${is('isMobile')`
    justify-content: center;
    height: 44px;
    margin: 0 15px 15px;
  `}
`;

const DropDownMenuItemStyled = styled(DropDownMenuItem)`
  display: flex;
  align-items: center;
  font-weight: 500;
`;

const ContactIcon = styled(Icon)`
  width: 30px;
  height: 30px;
`;

const ContactName = styled.div`
  flex: 1;
  margin-left: 10px;
  font-size: 14px;
`;

const ChevronIcon = styled(Icon).attrs({ name: 'chevron' })`
  width: 16px;
  height: 16px;
  margin-left: 10px;
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
    const { profile, isOwner, openModal } = this.props;

    openModal(SHOW_MODAL_MOBILE_MENU, {
      type: 'profile',
      profile,
      isOwner,
      blockUser: this.onBlockClick,
      sendPoints: this.sendPointsHandler,
      editBio: this.onEditBio,
    });
  };

  onOpenMobileContacts = () => {
    const { profile, openModal } = this.props;

    openModal(SHOW_MODAL_MOBILE_CONTACTS, {
      profile,
    });
  };

  onBlockClick = async () => {
    const { profile, blockUser, fetchProfile, waitForTransaction, t } = this.props;

    try {
      const result = await blockUser(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess(t('toastsMessages.success'));
    } catch (err) {
      displayError(err);
    }
  };

  onUnblockClick = async () => {
    const { profile, unblockUser, fetchProfile, waitForTransaction, t } = this.props;

    try {
      const result = await unblockUser(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess(t('toastsMessages.success'));
    } catch (err) {
      displayError(err);
    }
  };

  onSubscribeClick = async () => {
    const { profile, pin, fetchProfile, waitForTransaction, t } = this.props;

    try {
      const result = await pin(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess(t('toastsMessages.success'));
    } catch (err) {
      displayError(err);
    }
  };

  onUnsubscribeClick = async () => {
    const { profile, unpin, fetchProfile, waitForTransaction, t } = this.props;

    try {
      const result = await unpin(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess(t('toastsMessages.success'));
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

  renderCountersMobile() {
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
          {/* {profile.personal.websiteUrl ? ( */}
          {/*  <WebsiteField> */}
          {/*    <CounterName> */}
          {/*      &nbsp;•&nbsp; */}
          {/*      <WebsiteLink */}
          {/*        href={profile.personal.websiteUrl} */}
          {/*        target="_blank" */}
          {/*        rel="noopener noreferrer noindex" */}
          {/*      > */}
          {/*        {profile.personal.websiteUrl} */}
          {/*      </WebsiteLink> */}
          {/*    </CounterName> */}
          {/*  </WebsiteField> */}
          {/* ) : null} */}
        </CountersLeft>
      </CountersWrapper>
    );
  }

  renderContacts = () => {
    const { isMobile, profile, t } = this.props;

    if (!profile.personal.defaultContacts || !profile.personal.defaultContacts.length) {
      return null;
    }

    // One contact
    if (profile.personal.defaultContacts.length === 1) {
      const contact = profile.personal.messengers[profile.personal.defaultContacts[0]];

      if (!contact.href) {
        return null;
      }

      return (
        <ButtonStyled
          as="a"
          isMobile={isMobile}
          primary
          name="profile-header__contact"
          href={contact.href}
        >
          {t('components.profile.profile_header.contact')}
        </ButtonStyled>
      );
    }

    if (isMobile) {
      return (
        <ButtonStyled
          isMobile={isMobile}
          primary
          name="profile-header__contact"
          onClick={this.onOpenMobileContacts}
        >
          {t('components.profile.profile_header.contact')}
          <MoreIconMobile />
        </ButtonStyled>
      );
    }

    // More contacts
    return (
      <DropDownMenuContacts
        align="right"
        openAt="bottom"
        isMobile={isMobile}
        handler={props => (
          <ButtonStyled {...props} isMobile={isMobile} primary name="profile-header__contact">
            {t('components.profile.profile_header.contact')}
            <ChevronIcon />
          </ButtonStyled>
        )}
        items={() =>
          profile.personal.defaultContacts.map(contactId => {
            const contactItem = SOCIAL_MESSENGERS_LIST.find(item => item.contactId === contactId);
            const contact = profile.personal.messengers[contactItem.contactId];

            if (!contact.href) {
              return null;
            }

            if (contact) {
              return (
                <DropDownMenuItemStyled
                  key={contactId}
                  name={`profile-header__contact-${contactItem.name}`}
                  href={contact.href}
                >
                  <ContactIcon name={contactItem.iconName} />
                  <ContactName>{contactItem.name}</ContactName>
                </DropDownMenuItemStyled>
              );
            }
          })
        }
      />
    );
  };

  renderMoreDropDownMenu = (isMobile, isInBlacklist) => {
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

  renderFollow() {
    const { profile, t } = this.props;
    const { isSubscribed, isSubscription } = profile;

    let text = t('common.follow');

    if (isSubscribed) {
      if (isSubscription) {
        text = t('common.friends');
      } else {
        text = t('common.following');
      }
    } else if (isSubscription) {
      text = t('common.follow_back');
    }

    return (
      <AsyncAction onClickHandler={isSubscribed ? this.onUnsubscribeClick : this.onSubscribeClick}>
        <FollowButton
          primary={!isSubscribed}
          name={isSubscribed ? 'profile-header__unfollow' : 'profile-header__follow'}
        >
          {text}
        </FollowButton>
      </AsyncAction>
    );
  }

  render() {
    const { isOwner, profile, loggedUserId, isMobile, t } = this.props;
    const {
      userId,
      username,
      personal: { firstName, lastName },
      isInBlacklist,
    } = profile;

    const fullName = [firstName, lastName].filter(name => name).join(' ');

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
                <Name>{fullName || username}</Name>
                <JoinedDate>
                  <ProfileLink user={username}>
                    <Username>@{username}</Username>
                  </ProfileLink>
                  &nbsp;•&nbsp;
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
                {this.renderFollow()}
                {!isMobile ? this.renderContacts() : null}
                {this.renderMoreDropDownMenu(false, isInBlacklist)}
              </ActionsWrapperStyled>
            ) : null}
          </InfoWrapper>
          {isMobile ? (
            <InfoWrapperMobile>
              <Description profile={profile} isOwner={isOwner} isCompact isMobile />
              {!isOwner && loggedUserId ? this.renderContacts() : null}
              {isOwner ? (
                <BalanceWidgetWrapper>
                  <MobileBalanceWidget />
                </BalanceWidgetWrapper>
              ) : null}
              {this.renderCountersMobile()}
            </InfoWrapperMobile>
          ) : null}
        </ContentWrapper>
      </Wrapper>
    );
  }
}
