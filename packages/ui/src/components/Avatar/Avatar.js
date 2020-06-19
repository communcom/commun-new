import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

const AVATAR_SIZE = {
  xs: 20,
  small: 32,
  medium: 40,
  large: 50,
};

const ImgContainer = styled.div`
  display: inline-block;
  flex-shrink: 0;

  width: ${({ size }) => AVATAR_SIZE[size]}px;
  height: ${({ size }) => AVATAR_SIZE[size]}px;

  border-radius: 50%;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  display: block;

  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-position: center;
  object-fit: cover;
  background-color: ${({ theme }) => theme.colors.white};
`;

const AvatarPlaceholder = styled(Icon).attrs({ name: 'avatar' })`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  color: ${({ theme }) => theme.colors.lightGray};
  background-color: ${({ theme }) => theme.colors.white};
`;

/**
 * Компонент Аватар пользователя.
 */
const Avatar = ({ avatarUrl, name, size, className }) => (
  <ImgContainer size={size} className={className}>
    {avatarUrl ? (
      <AvatarImage src={avatarUrl} alt={name ? `${name}'s avatar` : null} draggable={false} />
    ) : (
      <AvatarPlaceholder aria-label={name ? `${name}'s avatar placeholder` : null} />
    )}
  </ImgContainer>
);

Avatar.propTypes = {
  /** Дополнительный класс */
  className: PropTypes.string,
  /** URL аватара */
  avatarUrl: PropTypes.string,
  /** Текстовая метка */
  name: PropTypes.string,
  /** Размер */
  size: PropTypes.oneOf(['xs', 'small', 'medium', 'large']),
};

Avatar.defaultProps = {
  className: undefined,
  avatarUrl: null,
  name: null,
  size: 'medium',
};

export default Avatar;
