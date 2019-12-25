import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { Icon } from '@commun/icons';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@commun/ui';

import { COMMUN_SYMBOL } from 'shared/constants';

import PointAvatar from '../PointAvatar';

const COMMUN_TOKEN = { symbol: COMMUN_SYMBOL };

const Wrapper = styled(List)`
  padding: 0;
  margin-bottom: 8px;
  min-height: 100%;
`;

const HistoryItem = styled(ListItem)`
  cursor: pointer;
`;

const Divider = styled.li`
  padding: 0 15px;

  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray};
`;

const PointBalance = styled(ListItemText)`
  & > p {
    text-align: right;
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
`;

const AvatarWithBadgeWrapper = styled.div`
  position: relative;
`;

const SecondaryAvatarWrapper = styled.div`
  position: absolute;

  bottom: 2px;
  right: -2px;

  height: 24px;

  border: 2px solid white;
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

export default class HistoryList extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({})),
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

  renderItem = ({ id, avatar, title, txType, amount, status }) => (
    <HistoryItem key={id} onItemClick={() => this.onItemClick(id /* TODO after wallet changes */)}>
      <ListItemAvatar>{avatar}</ListItemAvatar>
      <ListItemText primary={title} primaryBold secondary={txType} />
      <RightPanel>
        <PointBalance primary={amount} primaryBold secondary={status} />
      </RightPanel>
    </HistoryItem>
  );

  getRenderedItem = item => {
    const { id, meta, point, timestamp } = item;
    const status = dayjs(timestamp).format('HH:mm');

    if (meta.actionType === 'transfer') {
      const { sender, receiver } = item;

      const avatar = meta.direction === 'send' ? receiver.avatarUrl : sender.avatarUrl;
      const title = meta.direction === 'send' ? receiver.username : sender.username;
      const pointName = meta.transferType === 'point' ? point.name : 'Commun';
      const pointLogo = (
        <PointAvatar size="xs" point={meta.transferType === 'point' ? point : COMMUN_TOKEN} />
      );

      const amount =
        meta.direction === 'send' ? (
          `- ${item.quantity} ${pointName}`
        ) : (
          <GreenText>
            + {item.quantity} {pointName}
          </GreenText>
        );

      return this.renderItem({
        id,
        avatar: this.renderAvatar(avatar, pointLogo),
        title,
        txType: 'Transaction',
        amount,
        status,
      });
    }

    if (meta.actionType === 'convert') {
      const amount =
        meta.transferType === 'point' ? (
          <GreenText>+ {meta.exchangeAmount} Commun</GreenText>
        ) : (
          <GreenText>
            + {meta.exchangeAmount} {point.name}
          </GreenText>
        );

      const [primaryPoint, secondaryPoint] =
        meta.transferType === 'point' ? [COMMUN_TOKEN, point] : [point, COMMUN_TOKEN];

      return this.renderItem({
        id,
        avatar: this.renderPointAvatar(primaryPoint, secondaryPoint),
        title: 'Refill',
        txType: 'Convert',
        amount,
        status,
      });
    }

    if (meta.actionType === 'reward') {
      const amount = (
        <GreenText>
          + {item.quantity} {point.name}
        </GreenText>
      );

      return this.renderItem({
        id,
        avatar: this.renderPointAvatar(point),
        title: 'Reward',
        txType: '',
        amount,
        status,
      });
    }

    if (meta.actionType === 'hold') {
      const title = meta.holdType;
      const logo = <IconWrapper>{meta.holdType === 'like' ? <Like /> : <Dislike />} </IconWrapper>;

      return this.renderItem({
        id,
        avatar: logo,
        title,
        txType: 'hold',
        amount: `${item.quantity} ${point.name}`,
        status,
      });
    }

    return null;
  };

  render() {
    const { className, items } = this.props;

    return (
      <Wrapper className={className}>
        {items.reduce((acc, item, index, array) => {
          if (dayjs(item.timestamp).isBefore(array[index > 0 ? index - 1 : 0].timestamp, 'day')) {
            acc.push(<Divider key={item.timestamp}>{dayjs(item.timestamp).fromNow()}</Divider>);
          }

          acc.push(this.getRenderedItem(item));

          return acc;
        }, [])}
      </Wrapper>
    );
  }
}
