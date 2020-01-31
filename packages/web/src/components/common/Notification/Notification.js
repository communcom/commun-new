import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { notificationType } from 'types';
import { Link } from 'shared/routes';
import { proxifyImageUrl } from 'utils/images/proxy';

import Avatar from 'components/common/Avatar';
import { ProfileLink } from 'components/links';

import NotificationTypeIcon from './NotificationTypeIcon';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

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

function normalizeTime(timestamp) {
  const date = new Date(timestamp);
  const delta = Date.now() - date;

  if (delta >= 0) {
    if (delta < MINUTE) {
      return 'now';
    }

    if (delta < HOUR) {
      return `${Math.round(delta / MINUTE)}m ago`;
    }

    if (delta < 23.5 * HOUR) {
      return `${Math.round(delta / HOUR)}h ago`;
    }
  }

  return date.toLocaleString();
}

export default function Notification({ notification, isOnline, className }) {
  const { post, comment, isNew } = notification;
  const entry = comment || post || null;

  let route;
  let routeParams = null;
  let text = null;
  let initiator = null;

  switch (notification.eventType) {
    case 'reply':
      route = 'post';
      initiator = notification.author;
      text = `left a comment: “${entry.shortText}”`;
      break;

    case 'mention':
      route = 'post';
      initiator = notification.author;
      text = `mentioned you in a ${notification.entityType}: “${entry.shortText}”`;
      break;

    case 'upvote':
      route = 'post';
      initiator = notification.voter;
      text = `liked your ${notification.entityType}`;

      if (entry.shortText) {
        text += `: “${entry.shortText}”`;
      }
      break;

    case 'subscribe':
      route = 'profile';
      initiator = notification.user;
      text = 'is following you';
      break;

    case 'reward': {
      const { community, amount } = notification;
      route = 'walletSection';
      initiator = { ...community, isCommunity: true };
      text = `You've got ${amount} ${community.communityId} as a reward`;
      break;
    }

    case 'transfer': {
      const { from, amount, pointType, community } = notification;
      route = 'walletSection';
      initiator = from;

      if (!initiator.username) {
        text = `You received`;

        if (community) {
          initiator = { ...community, isCommunity: true };
        }
      } else {
        text = `sent you`;
      }

      text += ` ${amount} ${pointType === 'token' ? 'Commun' : community?.communityId}`;
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
      <Link route="community" params={{ communityAlias: initiator?.alias }} passHref>
        <AvatarWrapper>
          <AvatarStyled communityId={initiator.communityId} />
          <NotificationTypeIconStyled type={notification.eventType} isOnline={isOnline} />
          {isNew && !isOnline ? <NewMark /> : null}
        </AvatarWrapper>
      </Link>
    );
  } else {
    avatar = (
      <ProfileLink user={initiator?.username} allowEmpty>
        <AvatarWrapper>
          <AvatarStyled userId={initiator?.userId} />
          <NotificationTypeIconStyled type={notification.eventType} isOnline={isOnline} />
          {isNew && !isOnline ? <NewMark /> : null}
        </AvatarWrapper>
      </ProfileLink>
    );
  }

  return (
    <Link route={route} params={routeParams}>
      <Wrapper isOnline={isOnline} className={className}>
        {avatar}
        <TextBlock isOnline={isOnline}>
          <Text>
            {initiator && !initiator.isCommunity && initiator.username ? (
              <>
                <ProfileLink user={initiator.username} allowEmpty>
                  <Username>{initiator.username}</Username>
                </ProfileLink>{' '}
              </>
            ) : null}
            <Link route={route} params={routeParams} passHref>
              <TextLink isOnline={isOnline}>{text}</TextLink>
            </Link>
          </Text>
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
