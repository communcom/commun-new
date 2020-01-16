import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { List, ListItem, ListItemAvatar, ListItemText } from '@commun/ui';
import TokenAvatar from 'components/wallet/TokenAvatar';

const Wrapper = styled(List)`
  padding: 10px 0;
  min-height: 100%;
`;

const Item = styled(ListItem)`
  margin-bottom: 1px;

  background: #fff;
  cursor: pointer;

  &:first-child {
    border-radius: 10px 10px 0 0;
  }

  &:last-child {
    margin-bottom: 0px;
    border-radius: 0 0 10px 10px;
  }
`;

export default function TokensList({ className, tokens, onItemClick }) {
  return (
    <Wrapper className={className}>
      {tokens.map(({ image, symbol, fullName }) => (
        <Item key={symbol} onItemClick={() => onItemClick(symbol)}>
          <ListItemAvatar>
            <TokenAvatar name={symbol} fallbackImageUrl={image} />
          </ListItemAvatar>
          <ListItemText primary={symbol} primaryBold secondary={fullName} />
        </Item>
      ))}
    </Wrapper>
  );
}

TokensList.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.object),
  onItemClick: PropTypes.func.isRequired,
};

TokensList.defaultProps = {
  tokens: [],
};
