import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;

  ${is('isFluid')`
    width: 100%;
    height: auto;
  `};

  ${is('isSmall')`
    width: 30px;
    height: 30px;
  `};
`;

const defaultTokenAvatarUrl =
  'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@9867bdb19da14e63ffbe63805298fa60bf255cdd/svg/color/generic.svg';

const onImageError = image => e => {
  if (image) {
    e.target.onerror = () => {
      e.target.onerror = () => {};
      e.target.src = defaultTokenAvatarUrl;
    };
    e.target.src = `${image.replace('images/', 'images/coins/')}`;
  }

  e.target.src = defaultTokenAvatarUrl;
};

export default function TokenAvatar({ name, fallbackImageUrl, isFluid, isSmall }) {
  return (
    <Image
      src={`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@9867bdb19da14e63ffbe63805298fa60bf255cdd/svg/color/${name.toLowerCase()}.svg`}
      onError={onImageError(fallbackImageUrl)}
      title={name}
      isFluid={isFluid}
      isSmall={isSmall}
    />
  );
}

TokenAvatar.propTypes = {
  name: PropTypes.string,
  fallbackImageUrl: PropTypes.string,
  isFluid: PropTypes.bool,
  isSmall: PropTypes.bool,
};

TokenAvatar.defaultProps = {
  name: 'generic',
  fallbackImageUrl: undefined,
  isFluid: false,
  isSmall: false,
};
