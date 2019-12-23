import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 350px;
  overflow-x: scroll;
`;

const Item = styled.div``;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  margin: 0 5px;
`;

const TokensCarousel = ({ tokens, onSelectToken }) => {
  const onImageError = token => e => {
    e.target.onerror = () => {
      e.target.onerror = null;
      e.target.src = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@9867bdb19da14e63ffbe63805298fa60bf255cdd/svg/color/generic.svg`;
    };
    e.target.src = `${token.image.replace('images/', 'images/coins/')}`;
  };

  const handleSelectToken = token => () => {
    onSelectToken({ name: token.name.toUpperCase() });
  };

  return (
    <Wrapper>
      {tokens.map(token => (
        <Item onClick={handleSelectToken(token)}>
          <Image
            src={`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@9867bdb19da14e63ffbe63805298fa60bf255cdd/svg/color/${token.name}.svg`}
            onError={onImageError(token)}
            title={token.name}
          />
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
