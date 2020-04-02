import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { notificationType } from 'types';
import { Link } from 'shared/routes';
import { useTranslation } from 'shared/i18n';
import { proxifyImageUrl } from 'utils/images/proxy';
import { normalizeTime } from 'utils/format';

import Avatar from 'components/common/Avatar';
import { ProfileLink } from 'components/links';

import NotificationTypeIcon from './NotificationTypeIcon';

const Wrapper = styled.div`
  display: flex;
  padding: 10px 15px;
  color: #000;
  user-select: none;
  cursor: pointer;

  ${is('isOnline')`
    color: #fff;
  `};

  ${isNot('isOnline')`
    &:hover {
      background-color: #f7f8fc;
    }
  `};
`;

const AvatarWrapper = styled.a`
  position: relative;
  display: block;
  width: 44px;
  height: 44px;
  margin-right: 10px;
`;

const AvatarStyled = styled(Avatar)`
  width: 44px;
  height: 44px;
`;

const NewMark = styled.span`
  position: absolute;
  top: -3px;
  left: -3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.blue};
`;

const TextBlock = styled.p`
  margin-top: 2px;
  flex-grow: 1;
  overflow: hidden;

  ${is('isOnline')`
    display: flex;
    align-items: center;
    margin: 0;
  `};
`;

const Text = styled.span`
  display: block;
  line-height: 16px;
  font-size: 12px;
`;

const Username = styled.a`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue};

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const TextLink = styled.a`
  color: ${({ theme, isOnline }) =>
    isOnline ? theme.colors.white : theme.colors.black} !important;
`;

const Timestamp = styled.a`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray} !important;
`;

const PreviewImage = styled.img`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  margin-left: 15px;
  border-radius: 10px;
`;

const NotificationTypeIconStyled = styled(NotificationTypeIcon)`
  ${is('isOnline')`
    background-color: #24242c;
  `};
`;

export default function Notification({ notification, isOnline, className }) {
  const { t } = useTranslation();
  const { post, comment, isNew } = notification;
  const entry = comment || post || null;

  let route;
  let routeParams = null;
  let text = null;
  let initiator = null;
  let forceUsername = null;

  switch (notification.eventType) {
    case 'reply':
      route = 'post';
      initiator = notification.author;
      text = t('components.notification.reply', {
        shortText: entry.shortText ? `: “${entry.shortText}”` : '',
      });
      break;

    case 'mention':
      route = 'post';
      initiator = notification.author;
      text = t('components.notification.reply', {
        entityType: notification.entityType,
        shortText: entry.shortText,
      });
      break;

    case 'upvote':
      route = 'post';
      initiator = notification.voter;
      text = t('components.notification.upvote', { entityType: notification.entityType });

      if (entry.shortText) {
        text += `: “${entry.shortText}”`;
      }
      break;

    case 'subscribe':
      route = 'profile';
      initiator = notification.user;
      text = t('components.notification.subscribe');
      break;

    case 'reward': {
      const { community, amount } = notification;
      route = 'walletSection';
      initiator = { ...community, isCommunity: true };
      text = t('components.notification.reward', { amount, communityName: community.name });
      break;
    }

    case 'transfer': {
      const { from, amount, pointType, community } = notification;
      route = 'walletSection';
      initiator = from;

      if (!initiator.username) {
        text = t('components.notification.transfer.received');

        if (community) {
          initiator = { ...community, isCommunity: true };
        }
      } else {
        text = t('components.notification.transfer.sent_you');
      }

      text += ` ${amount} ${pointType === 'token' ? 'Commun' : community?.name}`;
      break;
    }

    case 'referralRegistrationBonus':
    case 'referralPurchaseBonus': {
      const { from, referral, amount, pointType, community, percent } = notification;
      route = 'walletSection';
      initiator = from;
      forceUsername = referral.username;
      const value = `${amount} ${pointType === 'token' ? 'Commun' : community?.name}`;

      if (notification.eventType === 'referralRegistrationBonus') {
        text = [
          `${t('components.notification.referralRegistrationBonus')} `,
          { $: 'username' },
          ` ${value}`,
        ];
      } else {
        text = [
          `${t('components.notification.referralPurchaseBonus', {
            amountStr: value,
            percent,
          })} `,
          { $: 'username' },
          `'s purchase`,
        ];
      }
      break;
    }

    default:
      // eslint-disable-next-line no-console
      console.error('Unsupported notification type:', notification.eventType);
      return null;
  }

  switch (route) {
    case 'post':
      if (comment) {
        routeParams = {
          communityAlias: notification.community.alias,
          username: comment.parents.post.username,
          permlink: comment.parents.post.permlink,
        };
      } else if (post) {
        routeParams = {
          communityAlias: notification.community.alias,
          username: post.contentId.username,
          permlink: post.contentId.permlink,
        };
      }

      break;

    case 'profile':
      routeParams = {
        username: initiator.username,
      };
      break;

    case 'walletSection':
      routeParams = {
        section: 'history',
      };
      break;

    default:
  }

  let avatar = null;

  if (initiator.isCommunity) {
    avatar = (
      <Link route="community" params={{ communityAlias: initiator.alias }} passHref>
        <AvatarWrapper>
          <AvatarStyled communityId={initiator.communityId} />
          <NotificationTypeIconStyled type={notification.eventType} isOnline={isOnline} />
          {isNew && !isOnline ? <NewMark /> : null}
        </AvatarWrapper>
      </Link>
    );
  } else {
    avatar = (
      <ProfileLink user={initiator.username} allowEmpty>
        <AvatarWrapper>
          <AvatarStyled userId={initiator.userId} />
          <NotificationTypeIconStyled type={notification.eventType} isOnline={isOnline} />
          {isNew && !isOnline ? <NewMark /> : null}
        </AvatarWrapper>
      </ProfileLink>
    );
  }

  function renderText() {
    let userLink = null;

    const username = forceUsername || (initiator && !initiator.isCommunity && initiator.username);

    if (username) {
      userLink = (
        <ProfileLink key="username" user={username} allowEmpty>
          <Username>{username}</Username>
        </ProfileLink>
      );
    }

    let inner;

    if (Array.isArray(text)) {
      inner = text.map((el, i) => {
        if (el && el.$) {
          switch (el.$) {
            case 'username':
              return userLink;
            default:
              // eslint-disable-next-line no-console
              console.warn('Unknown placeholder:', el.$);
              return null;
          }
        } else {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Link key={`part-${i}`} route={route} params={routeParams} passHref>
              <TextLink isOnline={isOnline}>{el}</TextLink>
            </Link>
          );
        }
      });
    } else {
      inner = [];

      if (userLink) {
        inner.push(<Fragment key="link">{userLink} </Fragment>);
      }

      inner.push(
        <Link key="text" route={route} params={routeParams} passHref>
          <TextLink isOnline={isOnline}>{text}</TextLink>
        </Link>
      );
    }

    return <Text>{inner}</Text>;
  }

  return (
    <Link route={route} params={routeParams}>
      <Wrapper isOnline={isOnline} className={className}>
        {avatar}
        <TextBlock isOnline={isOnline}>
          {renderText()}
          {isOnline ? null : (
            <Link route={route} params={routeParams} passHref>
              <Timestamp>{normalizeTime(notification.timestamp)}</Timestamp>
            </Link>
          )}
        </TextBlock>
        {entry?.imageUrl ? (
          <PreviewImage src={proxifyImageUrl(entry.imageUrl, { size: 44 })} />
        ) : null}
      </Wrapper>
    </Link>
  );
}

Notification.propTypes = {
  notification: notificationType.isRequired,
  isOnline: PropTypes.bool,
};

Notification.defaultProps = {
  isOnline: false,
};
