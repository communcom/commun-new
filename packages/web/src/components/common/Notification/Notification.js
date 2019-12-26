import React from 'react';
import styled from 'styled-components';

import { notificationType } from 'types';
import { Link } from 'shared/routes';

import Avatar from 'components/common/Avatar';
import { proxifyImageUrl } from 'utils/images/proxy';

import NotificationTypeIcon from './NotificationTypeIcon';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

const Wrapper = styled.div`
  display: flex;
  padding: 10px 15px;
  color: #000;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: #f7f8fc;
  }
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
  color: ${({ theme }) => theme.colors.black} !important;
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
  const { post, comment, isNew } = notification;
  const entry = comment || post || null;

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

    default:
  }

  return (
    <Link route={route} params={routeParams}>
      <Wrapper>
        <Link route="profile" params={{ username: initiator?.username }} passHref>
          <AvatarWrapper>
            <AvatarStyled userId={initiator?.userId} />
            <NotificationTypeIcon type={notification.eventType} />
            {isNew ? <NewMark /> : null}
          </AvatarWrapper>
        </Link>
        <TextBlock>
          <Text>
            {initiator ? (
              <>
                <Link route="profile" params={{ username: initiator.username }} passHref>
                  <Username>{initiator.username}</Username>
                </Link>{' '}
              </>
            ) : null}
            <Link route={route} params={routeParams} passHref>
              <TextLink>{text}</TextLink>
            </Link>
          </Text>
          <Link route={route} params={routeParams} passHref>
            <Timestamp>{normalizeTime(notification.timestamp)}</Timestamp>
          </Link>
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
