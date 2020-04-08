import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { Icon } from '@commun/icons';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@commun/ui';

import { COMMUN_SYMBOL } from 'shared/constants';
import { withTranslation } from 'shared/i18n';

import PointAvatar from 'components/wallet/PointAvatar';
import { ProfileLink } from 'components/links';

const COMMUN_TOKEN = { symbol: COMMUN_SYMBOL };

const Wrapper = styled(List)`
  padding: 0;
  margin-bottom: 8px;
  min-height: 100%;
`;

const HistoryItem = styled(ListItem)`
  padding: 10px 15px;
`;

const Divider = styled.li`
  padding: 15px;

  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray};
`;

const PointBalance = styled(ListItemText)`
  text-align: right;

  & > div {
    font-size: 14px;
  }
`;

const RightPanel = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
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
  color: ${({ theme }) => theme.colors.white};
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
    itemClickHandler: PropTypes.func,
  };

  static defaultProps = {
    items: [],
    itemClickHandler: undefined,
  };

  onItemClick = item => {
    const { itemClickHandler } = this.props;
    itemClickHandler(item);
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

  renderItem = ({ id, avatar, title, txType, amount, status }) => {
    const { t, i18n } = this.props;

    const txTypeTitle = i18n.exists(`components.wallet.history_list.types.${txType.toLowerCase()}`)
      ? t(`components.wallet.history_list.types.${txType.toLowerCase()}`)
      : txType;

    return (
      <HistoryItem
        key={id}
        onItemClick={() => this.onItemClick(id /* TODO after wallet changes */)}
      >
        <ListItemAvatar>{avatar}</ListItemAvatar>
        <ListItemText primary={title} primaryBold secondary={txTypeTitle} />
        <RightPanel>
          <PointBalance primary={amount} primaryBold secondary={status} />
        </RightPanel>
      </HistoryItem>
    );
  };

  getRenderedItem = item => {
    const { t } = this.props;
    const { id, meta, point, timestamp } = item;
    const status = dayjs(timestamp).format('HH:mm');

    if (['transfer', 'referralRegisterBonus', 'referralPurchaseBonus'].includes(meta.actionType)) {
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
        default:
      }

      return this.renderItem({
        id,
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
        avatar: this.renderPointAvatar(point),
        title: t('components.wallet.history_list.reward'),
        txType: '',
        amount,
        status,
      });
    }

    if (meta.actionType === 'hold' || meta.actionType === 'unhold') {
      const title = meta.holdType;
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
        avatar: logo,
        title,
        txType: '',
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
