import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { List, ListItem, ListItemAvatar, ListItemText } from '@commun/ui';

import TokenAvatar from 'components/pages/wallet/TokenAvatar';

const Wrapper = styled(List)`
  padding: 10px 0;
  min-height: 100%;
`;

const Item = styled(ListItem)`
  margin-bottom: 1px;

  background: ${({ theme }) => theme.colors.white};
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
      {tokens.map(item => (
        <Item key={item.symbol} onItemClick={() => onItemClick(item)}>
          <ListItemAvatar>
            <TokenAvatar name={item.symbol} fallbackImageUrl={item.image} />
          </ListItemAvatar>
          <ListItemText primary={item.symbol} primaryBold secondary={item.fullName} />
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
