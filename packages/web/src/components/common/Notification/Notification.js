import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';
import { isNil } from 'ramda';

import { Button } from '@commun/ui';
import { notificationType, userType } from 'types';
import { Link } from 'shared/routes';
import { useTranslation } from 'shared/i18n';
import { proxifyImageUrl } from 'utils/images/proxy';
import { normalizeTime } from 'utils/format';
import { displaySuccess, displayError } from 'utils/toastsMessages';

import Avatar from 'components/common/Avatar';
import { ProfileLink } from 'components/links';

import NotificationTypeIcon from './NotificationTypeIcon';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
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

const ButtonStyled = styled(Button)`
  flex-shrink: 0;
`;

function Notification({
  user,
  notification,
  isOnline,
  pin,
  // TODO: fetchProfile and waitForTransaction shouldn't be used in online notifications otherwise there is circular dependency in store/actions/gate
  fetchProfile,
  waitForTransaction,
  className,
}) {
  const [isFetchedUser, setIsFetchedUser] = useState(false);
  const { t, i18n } = useTranslation();
  const { post, comment, isNew } = notification;
  const entry = comment || post || null;

  let route;
  let routeParams = null;
  let text = null;
  let initiator = null;
  let forceUsername = null;

  useEffect(() => {
    const fetchUserProfileIfNeed = async () => {
      if (
        !isOnline &&
        !isFetchedUser &&
        notification?.user?.userId &&
        (!user || (user && isNil(user.isSubscribed)))
      ) {
        setIsFetchedUser(true);
        await fetchProfile({ userId: notification.user.userId });
      }
    };

    fetchUserProfileIfNeed();
  }, [fetchProfile, isFetchedUser, notification, user, isOnline]);

  switch (notification.eventType) {
    case 'reply':
      route = 'post';
      initiator = notification.author;
      text = t('components.notification.types.reply', {
        shortText: entry.shortText ? `: “${entry.shortText}”` : '',
      });
      break;

    case 'mention':
      route = 'post';
      initiator = notification.author;
      text = t('components.notification.types.reply', {
        entityType: i18n.exists(`components.notification.${notification.entityType}`)
          ? t(`components.notification.${notification.entityType}`, { context: 'prep' })
          : notification.entityType,
        shortText: entry.shortText,
      });
      break;

    case 'upvote':
      route = 'post';
      initiator = notification.voter;
      text = t('components.notification.types.upvote', { entityType: notification.entityType });

      if (entry.shortText) {
        text += `: “${entry.shortText}”`;
      }
      break;

    case 'subscribe':
      route = 'profile';
      initiator = notification.user;
      text = t('components.notification.types.subscribe');
      break;

    case 'reward': {
      const { community, amount } = notification;
      route = 'walletSection';
      initiator = { ...community, isCommunity: true };
      text = t('components.notification.types.reward', { amount, communityName: community.name });
      break;
    }

    case 'transfer': {
      const { from, amount, pointType, community } = notification;
      route = 'walletSection';
      initiator = from;

      if (!initiator.username) {
        text = t('components.notification.types.transfer.received');

        if (community) {
          initiator = { ...community, isCommunity: true };
        }
      } else {
        text = t('components.notification.types.transfer.sent_you');
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
          `${t('components.notification.types.referralRegistrationBonus')} `,
          { $: 'username' },
          ` ${value}`,
        ];
      } else {
        text = [
          `${t('components.notification.types.referralPurchaseBonus.first', {
            amountStr: value,
            percent,
          })} `,
          { $: 'username' },
          t('components.notification.types.referralPurchaseBonus.last'),
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

  async function onSubscribeClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isOnline || notification.eventType !== 'subscribe') {
      return;
    }

    try {
      const result = await pin(initiator.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: initiator.userId });
      displaySuccess(t('toastsMessages.success'));
    } catch (err) {
      displayError(err);
    }
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

  function renderRightBlock() {
    if (!isOnline && notification.eventType === 'subscribe' && user && !user.isSubscribed) {
      return (
        <ButtonStyled primary onClick={onSubscribeClick}>
          {t('common.follow')}
        </ButtonStyled>
      );
    }

    if (entry?.imageUrl) {
      return <PreviewImage src={proxifyImageUrl(entry.imageUrl, { size: 44 })} />;
    }

    return null;
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
        {renderRightBlock()}
      </Wrapper>
    </Link>
  );
}

Notification.propTypes = {
  notification: notificationType.isRequired,
  user: userType,
  isOnline: PropTypes.bool,

  pin: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func,
  waitForTransaction: PropTypes.func,
};

Notification.defaultProps = {
  isOnline: false,
  user: null,

  fetchProfile: null,
  waitForTransaction: null,
};

export default Notification;
