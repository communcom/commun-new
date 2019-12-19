import React from 'react';
import styled from 'styled-components';

import { notificationType } from 'types';
import { Link } from 'shared/routes';

import Avatar from 'components/common/Avatar';
import { proxifyImageUrl } from 'utils/images/proxy';

import NotificationTypeIcon from './NotificationTypeIcon';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

const Wrapper = styled.a`
  display: flex;
  align-items: center;
  padding: 0 15px;
  color: #000;
  user-select: none;
  cursor: pointer;
`;

const AvatarWrapper = styled.span`
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

const TextBlock = styled.p`
  flex-grow: 1;
`;

const Text = styled.span`
  display: block;
  line-height: 16px;
  font-size: 12px;
`;

const Username = styled.b`
  font-weight: 600;
`;

const Timestamp = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const PreviewImage = styled.img`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  margin-left: 15px;
  border-radius: 10px;
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

export default function Notification({ notification }) {
  const entry = notification.comment || notification.post || null;
  let route;
  let routeParams = null;
  let text = null;
  let initiator = null;

  switch (notification.eventType) {
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

    default:
      // eslint-disable-next-line no-console
      console.error('Unsupported notification type:', notification.eventType);
      return null;
  }

  switch (route) {
    case 'post':
      routeParams = {
        communityAlias: notification.community.alias,
        username: initiator.username,
        permlink: entry.contentId.permlink,
      };
      break;

    case 'profile':
      routeParams = {
        username: initiator.username,
      };
      break;

    default:
  }

  return (
    <Link route={route} params={routeParams} passHref>
      <Wrapper>
        <AvatarWrapper>
          <AvatarStyled userId={initiator?.userId} />
          <NotificationTypeIcon type={notification.eventType} />
        </AvatarWrapper>
        <TextBlock>
          <Text>
            {initiator ? (
              <>
                <Username>{initiator.username}</Username>{' '}
              </>
            ) : null}
            {text}
          </Text>
          <Timestamp>{normalizeTime(notification.timestamp)}</Timestamp>
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
};
