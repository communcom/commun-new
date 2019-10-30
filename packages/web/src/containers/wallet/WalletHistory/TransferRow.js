import React from 'react';
import dayjs from 'dayjs';

import { Link } from 'shared/routes';
import { transferType } from 'types/common';

import {
  Item,
  IconWrapper,
  IconStyled,
  ItemBodyWrapper,
  ItemBody,
  ItemLine,
  Currency,
  ItemLink,
  ItemValues,
  Value,
} from './commonStyled';

const TransferRow = ({ item }) => {
  const receiver = item.receiver.username || item.receiver.userId;
  const sender = item.sender.username || item.sender.userId;

  switch (item.data.direction) {
    case 'send':
      return (
        <Item>
          <IconWrapper>
            <IconStyled name="send-points" />
          </IconWrapper>
          <ItemBodyWrapper>
            <ItemBody>
              <ItemLine>
                Send <Currency>{item.symbol}</Currency> to{' '}
                <Link route={`/@${receiver}`} passHref>
                  <ItemLink>@{receiver}</ItemLink>
                </Link>
              </ItemLine>
              <ItemLine>{dayjs(item.timestamp).fromNow()}</ItemLine>
            </ItemBody>
          </ItemBodyWrapper>
          <ItemValues>
            <ItemLine isValue>
              <Value isNegative>-{item.quantity}</Value>
            </ItemLine>
          </ItemValues>
        </Item>
      );

    case 'receive':
      return (
        <Item key={item.id}>
          <IconWrapper>
            <IconStyled name="receive-points" />
          </IconWrapper>
          <ItemBodyWrapper>
            <ItemBody>
              <ItemLine>
                Receive <Currency>{item.symbol}</Currency> from{' '}
                <Link route={`/@${sender}`} passHref>
                  <ItemLink>@{sender}</ItemLink>
                </Link>
              </ItemLine>
              <ItemLine>{dayjs(item.timestamp).fromNow()}</ItemLine>
            </ItemBody>
          </ItemBodyWrapper>
          <ItemValues>
            <ItemLine isValue>
              <Value>+{item.quantity}</Value>
            </ItemLine>
          </ItemValues>
        </Item>
      );
    default:
      return null;
  }
};

TransferRow.propTypes = {
  item: transferType.isRequired,
};

export default TransferRow;
