import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Image = styled.img`
  width: 50px;
  height: 50px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  margin: 0 5px;
`;

const defaultTokenAvatarUrl =
  'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@9867bdb19da14e63ffbe63805298fa60bf255cdd/svg/color/generic.svg';

const onImageError = image => e => {
  if (image) {
    e.target.onerror = () => {
      e.target.onerror = null;
      e.target.src = defaultTokenAvatarUrl;
    };
    e.target.src = `${image.replace('images/', 'images/coins/')}`;
  }

  e.target.src = defaultTokenAvatarUrl;
};

export default function TokenAvatar({ name, fallbackImageUrl }) {
  return (
    <Image
      src={`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@9867bdb19da14e63ffbe63805298fa60bf255cdd/svg/color/${name}.svg`}
      onError={onImageError(fallbackImageUrl)}
      title={name}
    />
  );
}

TokenAvatar.propTypes = {
  name: PropTypes.string,

  fallbackImageUrl: PropTypes.string,
};

TokenAvatar.defaultProps = {
  name: 'generic',
  fallbackImageUrl: undefined,
};
