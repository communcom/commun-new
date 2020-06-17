import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { Icon } from '@commun/icons';
import { List, Avatar } from '@commun/ui';

import { COMMUN_SYMBOL } from 'shared/constants';
import { withTranslation } from 'shared/i18n';

import PointAvatar from 'components/pages/wallet/PointAvatar';
import { ProfileLink } from 'components/links';
import HistoryItem from 'components/pages/wallet/history/HistoryItem';

const COMMUN_TOKEN = { symbol: COMMUN_SYMBOL };

const Wrapper = styled(List)`
  padding: 0;
  margin-bottom: 8px;
  min-height: 100%;
`;

const Divider = styled.li`
  padding: 15px;

  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray};
`;

const GreenText = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.green};
  text-align: right;
`;

const PointName = styled.span`
  font-size: 12px;
`;

const AvatarWithBadgeWrapper = styled.div`
  position: relative;
  display: flex;
`;

const SecondaryAvatarWrapper = styled.div`
  position: absolute;

  bottom: -2px;
  right: -2px;

  height: 24px;

  border: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 50px;
  height: 50px;
  min-width: 50px;

  background-color: ${({ theme }) => theme.colors.gray};
  color: #fff;
  border-radius: 50%;
`;

const Dislike = styled(Icon).attrs({ name: 'vote-comments-arrow' })`
  width: 24px;
  height: 24px;
`;

const Like = styled(Icon).attrs({ name: 'vote-comments-arrow' })`
  width: 24px;
  height: 24px;

  transform: rotate(180deg);
`;

const Username = styled.a`
  color: ${({ theme }) => theme.colors.blue};
`;

@withTranslation()
export default class HistoryList extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    items: [],
  };

  renderAvatar = (primaryAvatarUrl, secondaryAvatar) => (
    <AvatarWithBadgeWrapper>
      <Avatar size="large" avatarUrl={primaryAvatarUrl} />
      {secondaryAvatar && <SecondaryAvatarWrapper>{secondaryAvatar}</SecondaryAvatarWrapper>}
    </AvatarWithBadgeWrapper>
  );

  renderPointAvatar = (primaryPoint, secondaryPoint) => (
    <AvatarWithBadgeWrapper>
      <PointAvatar point={primaryPoint} />
      {secondaryPoint && (
        <SecondaryAvatarWrapper>
          <PointAvatar size="xs" point={secondaryPoint} />
        </SecondaryAvatarWrapper>
      )}
    </AvatarWithBadgeWrapper>
  );

  renderItem = item => <HistoryItem key={item.id} item={item} />;

  getRenderedItem = item => {
    const { t } = this.props;
    const { id, trxId, meta, memo, point, timestamp } = item;
    const status = dayjs(timestamp).format('HH:mm');

    if (
      ['transfer', 'donation', 'referralRegisterBonus', 'referralPurchaseBonus'].includes(
        meta.actionType
      )
    ) {
      const { receiver, sender, referral } = item;

      const avatar = meta.direction === 'send' ? receiver.avatarUrl : sender.avatarUrl;
      const title = meta.direction === 'send' ? receiver.username : sender.username;
      const pointName = meta.transferType === 'point' ? point.name : 'Commun';
      const pointLogo = (
        <PointAvatar size="xs" point={meta.transferType === 'point' ? point : COMMUN_TOKEN} />
      );

      const amount =
        meta.direction === 'send' ? (
          <>
            {`- ${item.quantity}`} <PointName>{pointName}</PointName>
          </>
        ) : (
          <GreenText>
            {`+ ${item.quantity}`} <PointName>{pointName}</PointName>
          </GreenText>
        );

      let txType = t('components.wallet.history_list.types.transaction');

      switch (meta.actionType) {
        case 'referralRegisterBonus':
          txType = (
            <>
              {t('components.wallet.history_list.types.referralRegisterBonus')}{' '}
              <ProfileLink user={referral}>
                <Username>{referral.username}</Username>
              </ProfileLink>
            </>
          );
          break;
        case 'referralPurchaseBonus':
          txType = (
            <>
              {t('components.wallet.history_list.types.referralPurchaseBonus.first', {
                percent: meta.percent,
              })}{' '}
              <ProfileLink user={referral}>
                <Username>{referral.username}</Username>
              </ProfileLink>
              {t('components.wallet.history_list.types.referralPurchaseBonus.last')}
            </>
          );
          break;
        case 'donation':
          txType = t('components.wallet.history_list.types.donation');
          break;
        default:
      }

      return this.renderItem({
        id,
        trxId,
        memo,
        avatar: this.renderAvatar(avatar, pointLogo),
        title,
        txType,
        amount,
        status,
      });
    }

    if (meta.actionType === 'convert') {
      const amount =
        meta.transferType === 'point' ? (
          <GreenText>
            + {meta.exchangeAmount} <PointName>Commun</PointName>
          </GreenText>
        ) : (
          <GreenText>
            + {meta.exchangeAmount} <PointName>{point.name}</PointName>
          </GreenText>
        );

      const [primaryPoint, secondaryPoint] =
        meta.transferType === 'point' ? [COMMUN_TOKEN, point] : [point, COMMUN_TOKEN];

      return this.renderItem({
        id,
        trxId,
        memo,
        avatar: this.renderPointAvatar(primaryPoint, secondaryPoint),
        title: t('components.wallet.history_list.refill'),
        txType: t('components.wallet.history_list.types.convert'),
        amount,
        status,
      });
    }

    if (meta.actionType === 'reward') {
      const amount = (
        <GreenText>
          + {item.quantity} <PointName>{point.name}</PointName>
        </GreenText>
      );

      return this.renderItem({
        id,
        trxId,
        memo,
        avatar: this.renderPointAvatar(point),
        title: t('components.wallet.history_list.reward'),
        txType: '',
        amount,
        status,
      });
    }

    if (meta.actionType === 'hold' || meta.actionType === 'unhold') {
      const title = meta.holdType === 'like' ? t('common.like') : t('common.dislike');
      const logo = <IconWrapper>{meta.holdType === 'like' ? <Like /> : <Dislike />} </IconWrapper>;
      const amount =
        meta.actionType === 'unhold' ? (
          <GreenText>
            + {item.quantity} <PointName>{point.name}</PointName>
          </GreenText>
        ) : (
          <>
            {item.quantity} <PointName>{point.name}</PointName>
          </>
        );

      return this.renderItem({
        id,
        trxId,
        memo,
        avatar: logo,
        title,
        txType: t('components.wallet.history_list.types.curator'),
        amount,
        status,
      });
    }

    if (meta.actionType === 'claim') {
      const amount = (
        <GreenText>
          + {item.quantity} <PointName>{point.name}</PointName>
        </GreenText>
      );

      return this.renderItem({
        id,
        trxId,
        memo,
        avatar: this.renderPointAvatar(point),
        title: t('components.wallet.history_list.types.leader_reward'),
        txType: '',
        amount,
        status,
      });
    }

    return null;
  };

  render() {
    const { className, items, t } = this.props;

    const list = items.reduce((acc, item, index, array) => {
      if (dayjs(item.timestamp).isBefore(array[index > 0 ? index - 1 : 0].timestamp, 'day')) {
        acc.push(<Divider key={`${item.id}_1`}>{dayjs(item.timestamp).fromNow()}</Divider>);
      }

      acc.push(this.getRenderedItem(item));

      return acc;
    }, []);

    if (dayjs().isSame(items[0].timestamp, 'day')) {
      list.unshift(
        <Divider key={`${items[0].id}_2`}>{t('components.wallet.history_list.today')}</Divider>
      );
    } else {
      list.unshift(
        <Divider key={`${items[0].id}_2`}>{dayjs(items[0].timestamp).fromNow()}</Divider>
      );
    }

    return <Wrapper className={className}>{list}</Wrapper>;
  }
}
