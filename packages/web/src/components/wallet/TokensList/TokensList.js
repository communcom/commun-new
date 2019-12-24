import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { List, ListItem, ListItemAvatar, ListItemText } from '@commun/ui';
import TokenAvatar from 'components/wallet/TokenAvatar';

const Wrapper = styled(List)`
  padding: 15px 0;
  margin-bottom: 8px;
  min-height: 100%;
`;

const Item = styled(ListItem)`
  margin-bottom: 10px;

  background: #fff;
  border-radius: 10px;
  cursor: pointer;
`;

export default function TokensList({ className, tokens, onItemClick }) {
  return (
    <Wrapper className={className}>
      {tokens.map(({ image, name, fullName }) => (
        <Item key={name} onItemClick={() => onItemClick(name.toUpperCase())}>
          <ListItemAvatar>
            <TokenAvatar name={name} fallbackImageUrl={image} />
          </ListItemAvatar>
          <ListItemText primary={name} primaryBold secondary={fullName} />
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
