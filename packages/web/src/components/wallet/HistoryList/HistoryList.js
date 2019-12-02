import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { Icon } from '@commun/icons';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@commun/ui';

const Wrapper = styled(List)`
  padding: 0;
  margin-bottom: 8px;
  min-height: 100%;
`;

const HistoryItem = styled(ListItem)`
  cursor: pointer;

  & p {
    margin-top: 0;
  }
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

  renderAvatar = (primaryAvatarUrl, secondaryAvatarUrl) => (
    <AvatarWithBadgeWrapper>
      <Avatar size="large" avatarUrl={primaryAvatarUrl} />
      {secondaryAvatarUrl && (
        <SecondaryAvatarWrapper>
          <Avatar size="xs" avatarUrl={secondaryAvatarUrl} />
        </SecondaryAvatarWrapper>
      )}
    </AvatarWithBadgeWrapper>
  );

  renerItem = (id, avatar, title, txType, amount, status, onItemClick) => (
    <HistoryItem key={id} onItemClick={onItemClick}>
      <ListItemAvatar>{avatar}</ListItemAvatar>
      <ListItemText primary={title} primaryBold secondary={txType} />
      <RightPanel>
        <PointBalance primary={amount} primaryBold secondary={status} />
      </RightPanel>
    </HistoryItem>
  );

  getRenderedItem = (item, itemClickHandler) => {
    const { id, meta, point, timestamp } = item;
    const status = dayjs(timestamp).format('HH:mm');

    if (meta.actionType === 'transfer') {
      const { sender, receiver } = item;

      const avatar = meta.direction === 'send' ? receiver.avatarUrl : sender.avatarUrl;
      const title = meta.direction === 'send' ? receiver.username : sender.username;
      const pointName = meta.transferType === 'point' ? point.name : 'Commun';
      const pointLogo =
        meta.transferType === 'point'
          ? point.logo
          : // TODO fix after wallet changes
            'https://img.commun.com/images/3qzfJEenqaqgArYz8vvuyNqZ1DRt.jpg';
      const amount =
        meta.direction === 'send' ? (
          `- ${item.quantity} ${pointName}`
        ) : (
          <GreenText>
            + {item.quantity} {pointName}
          </GreenText>
        );

      return this.renerItem(
        id,
        this.renderAvatar(avatar, pointLogo),
        title,
        'Transaction',
        amount,
        status,
        () => {
          itemClickHandler(item.trxId);
        }
      );
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

      return this.renerItem(
        id,
        this.renderAvatar(point.logo),
        'Refill',
        'Convert',
        amount,
        status,
        () => {
          itemClickHandler(item.trxId);
        }
      );
    }

    if (meta.actionType === 'reward') {
      const amount = (
        <GreenText>
          + {item.quantity} {point.name}
        </GreenText>
      );

      return this.renerItem(id, this.renderAvatar(point.logo), 'Reward', '', amount, status, () => {
        itemClickHandler(item.trxId);
      });
    }

    if (meta.actionType === 'hold') {
      const title = meta.holdType;
      const logo = <IconWrapper>{meta.holdType === 'like' ? <Like /> : <Dislike />} </IconWrapper>;
      const amount = (
        <GreenText>
          + {item.quantity} {point.name}
        </GreenText>
      );

      return this.renerItem(id, logo, title, 'hold', amount, status, () => {
        itemClickHandler(item.trxId);
      });
    }

    return null;
  };

  render() {
    const { className, items, itemClickHandler } = this.props;

    return (
      <Wrapper className={className}>
        {items.reduce((acc, item, index, array) => {
          if (dayjs(item.timestamp).isBefore(array[index > 0 ? index - 1 : 0].timestamp, 'day')) {
            acc.push(<Divider key={item.timestamp}>{dayjs(item.timestamp).fromNow()}</Divider>);
          }

          acc.push(this.getRenderedItem(item, itemClickHandler));

          return acc;
        }, [])}
      </Wrapper>
    );
  }
}
