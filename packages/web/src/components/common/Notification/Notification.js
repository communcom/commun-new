import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import dayjs from 'dayjs';

import { Link } from 'shared/routes';
import { up } from '@commun/ui';
import { Icon } from '@commun/icons';
import Avatar from 'components/common/Avatar';

const TEXT_LIMIT = 40;

const TYPES_DETAILS = {
  upvote: {
    text: 'upvoted your post',
    icon: 'vote-comments-arrow',
  },
  downvote: {
    text: 'downvoted your post',
    icon: 'vote-comments-arrow',
  },
  subscribe: {
    text: 'subscribed to you',
    icon: 'add',
  },
  unsubscribe: {
    text: 'unsubscribed from you',
    icon: 'block',
  },
  transfer: {
    textFunc: n => `transfer to you ${n.value.amount} points`,
    icon: 'transfer-points',
  },
  reply: {
    text: 'replied on your comment',
    icon: 'chat',
  },
  mention: {
    textFunc: n => `mention you in ${n.comment ? 'comment' : 'post'}`,
    icon: 'notifications',
  },
  reward: {
    icon: 'post-rewards',
  },
  votesReward: {
    icon: 'votes-rewards',
  },
  curatorReward: {
    icon: 'votes-rewards',
  },
};

function cut(text) {
  if (text.length > TEXT_LIMIT) {
    return `${text.substr(0, TEXT_LIMIT)}...`;
  }

  return text;
}

const WrapperLink = styled.a`
  display: flex;
  padding: 12px 16px 12px 19px;
  color: #000;

  &:hover {
    background-color: #f6f6f6;
  }

  ${is('isNew')`
    background: #f0f2f7;
    
    &:hover {
      background-color: #ededf5;
    }
  `};
`;

const RewardLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.contextBlue};

  ${up.tablet} {
    width: 56px;
    height: 56px;

    ${is('isCompact')`
      width: 40px;
      height: 40px;
    `};
  }
`;

const RewardIcon = styled(Icon)`
  width: 24px;
  height: 24px;
  color: #fff;
`;

const Body = styled.div`
  margin-top: -2px;
  margin-left: 16px;
`;

const CreatedInfo = styled.div`
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.contextGrey};

  ${up.tablet} {
    font-size: 15px;

    ${is('isCompact')`
      font-size: 13px;
    `};
  }
`;

const TextWrapper = styled.div`
  margin-top: 4px;
  overflow: hidden;
`;

const Text = styled.p`
  line-height: 20px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.41px;
`;

const EntityTitle = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

const AuthorName = styled.span`
  color: ${({ theme }) => theme.colors.contextBlack};
`;

const AvatarWrapper = styled.div`
  position: relative;
  height: 40px;

  ${up.tablet} {
    height: 56px;

    ${is('isCompact')`
      height: 40px;
    `};
  }
`;

const NotifMark = styled.div`
  position: absolute;
  left: -5px;
  bottom: -5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.contextBlue};
  pointer-events: none;

  ${up.tablet} {
    left: -4px;
    bottom: -4px;

    ${is('isCompact')`
      left: -5px;
      height: 20px;
    `};
  }
`;

const NotifIcon = styled(Icon)`
  width: 14px;
  height: 14px;
  color: #fff;
`;

const CustomAvatar = styled(Avatar)`
  ${up.tablet} {
    width: 56px;
    height: 56px;

    ${is('isCompact')`
      width: 40px;
      height: 40px;
    `};
  }
`;

export default class Notification extends Component {
  static propTypes = {
    notification: PropTypes.shape({}).isRequired,
    isCompact: PropTypes.bool,
    markAsRead: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isCompact: false,
  };

  onLinkClick = () => {
    const { notification, markAsRead } = this.props;

    if (notification.unread) {
      markAsRead(notification.id).catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
    }
  };

  renderNotificationText() {
    const { notification, isCompact } = this.props;
    const { eventType, post, comment, actor, value } = notification;

    let textBlock;
    let valueStr = '';

    if (value) {
      valueStr = `${value.amount} ${value.currency} `;
    }

    switch (eventType) {
      case 'reward':
        textBlock = `Reward ${valueStr}for`;
        break;
      case 'curatorReward':
        textBlock = `Curator reward ${valueStr}for`;
        break;
      default: {
        const info = TYPES_DETAILS[eventType];

        if (!info) {
          // eslint-disable-next-line no-console
          console.error('Bad notification data:', notification);
          return `Unknown notification type: ${eventType}`;
        }

        const text = info.textFunc ? info.textFunc(notification) : info.text;

        textBlock = (
          <>
            <AuthorName>{actor.name || actor.id}</AuthorName> {text}
          </>
        );
      }
    }

    let entityText = null;

    if (comment) {
      entityText = comment.body;
    } else if (post) {
      entityText = post.title;
    }

    if (entityText && isCompact) {
      entityText = cut(entityText);
    }

    return (
      <Text>
        {textBlock}
        {entityText ? (
          <>
            {' '}
            <EntityTitle>“{entityText}”</EntityTitle>
          </>
        ) : null}
      </Text>
    );
  }

  renderRewardLogo() {
    const { notification, isCompact } = this.props;
    const info = TYPES_DETAILS[notification.eventType];

    return (
      <RewardLogo isCompact={isCompact}>{info ? <RewardIcon name={info.icon} /> : null}</RewardLogo>
    );
  }

  renderNotificationAvatar() {
    const { notification, isCompact } = this.props;
    const info = TYPES_DETAILS[notification.eventType];

    return (
      <AvatarWrapper isCompact={isCompact}>
        {info ? (
          <NotifMark isCompact={isCompact}>
            <NotifIcon name={info.icon} />
          </NotifMark>
        ) : null}
        <CustomAvatar userId={notification.actor.id} isCompact={isCompact} />
      </AvatarWrapper>
    );
  }

  render() {
    const { notification, isCompact } = this.props;
    const { actor, eventType, community, timestamp } = notification;

    let linkProps = null;

    switch (eventType) {
      case 'transfer':
        linkProps = {
          route: 'wallet',
        };
        break;
      case 'upvote':
      case 'downvote':
      case 'mention':
      case 'curatorReward':
        linkProps = {
          route: 'post',
          params: notification.post.contentId,
        };
        break;
      case 'reply':
        linkProps = {
          route: 'post',
          params: notification.post.contentId,
        };
        break;
      default:
        linkProps = {
          route: 'home',
        };
    }

    return (
      <Link {...linkProps} passHref>
        <WrapperLink isNew={notification.unread} onClick={this.onLinkClick}>
          {actor ? this.renderNotificationAvatar() : this.renderRewardLogo()}
          <Body>
            <CreatedInfo isCompact={isCompact}>
              {dayjs(timestamp).fromNow()} in {community.name}
            </CreatedInfo>
            <TextWrapper>{this.renderNotificationText()}</TextWrapper>
          </Body>
        </WrapperLink>
      </Link>
    );
  }
}
