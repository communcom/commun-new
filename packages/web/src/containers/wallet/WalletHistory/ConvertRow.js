import React from 'react';
import dayjs from 'dayjs';

import { transferType } from 'types/common';

import {
  Item,
  IconWrapper,
  IconStyled,
  ItemBodyWrapper,
  ItemBody,
  ItemLine,
  Currency,
  ItemValues,
  Value,
} from './commonStyled';

const ConvertRow = ({ item }) => (
  <Item>
    <IconWrapper>
      <IconStyled name="transfer-points" />
    </IconWrapper>
    <ItemBodyWrapper>
      <ItemBody>
        <ItemLine>
          Convert in <Currency>{item.data.symbol}</Currency>
        </ItemLine>
        <ItemLine>
          from <Currency>{item.symbol}</Currency> {dayjs(item.timestamp).fromNow()}
        </ItemLine>
      </ItemBody>
    </ItemBodyWrapper>
    <ItemValues>
      <ItemLine isValue>
        <Value>+{item.data.receivedAmount}</Value>
      </ItemLine>
      <ItemLine isValue>
        <Value>-{item.quantity}</Value>
      </ItemLine>
    </ItemValues>
  </Item>
);

ConvertRow.propTypes = {
  item: transferType.isRequired,
};

export default ConvertRow;
