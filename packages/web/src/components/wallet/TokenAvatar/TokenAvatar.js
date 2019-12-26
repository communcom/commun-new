import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

const Image = styled.img`
  width: 50px;
  height: 50px;
  border: 2px solid #ffffff;
  border-radius: 50%;

  ${is('fluid')`
    width: 100%;
    height: auto;
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

export default function TokenAvatar({ name, fallbackImageUrl, fluid }) {
  return (
    <Image
      src={`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@9867bdb19da14e63ffbe63805298fa60bf255cdd/svg/color/${name.toLowerCase()}.svg`}
      onError={onImageError(fallbackImageUrl)}
      title={name}
      fluid={fluid}
    />
  );
}

TokenAvatar.propTypes = {
  name: PropTypes.string,
  fallbackImageUrl: PropTypes.string,
  fluid: PropTypes.bool,
};

TokenAvatar.defaultProps = {
  name: 'generic',
  fallbackImageUrl: undefined,
  fluid: false,
};
