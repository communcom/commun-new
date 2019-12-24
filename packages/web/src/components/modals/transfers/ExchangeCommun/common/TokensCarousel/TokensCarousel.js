import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TokenAvatar from 'components/wallet/TokenAvatar/TokenAvatar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 350px;
  overflow-x: scroll;
`;

const Item = styled.div``;

const TokensCarousel = ({ tokens, onSelectToken }) => {
  const handleSelectToken = token => () => {
    onSelectToken({ name: token.name.toUpperCase() });
  };

  return (
    <Wrapper>
      {tokens.map(token => (
        <Item onClick={handleSelectToken(token)}>
          <TokenAvatar name={token.name} fallbackImageUrl={token.image} />
        </Item>
      ))}
    </Wrapper>
  );
};

TokensCarousel.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.object),
  onSelectToken: PropTypes.func.isRequired,
};

TokensCarousel.defaultProps = {
  tokens: [],
};

export default TokensCarousel;
