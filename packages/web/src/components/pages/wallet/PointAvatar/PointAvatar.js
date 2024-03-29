import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Avatar } from '@commun/ui';

import { COMMUN_SYMBOL } from 'shared/constants';

const COMMUN_ICON_SIZE = {
  xs: 20,
  large: 50,
};

const CommunIcon = styled(Icon).attrs({ name: 'commun' })`
  width: ${({ iconSize }) => COMMUN_ICON_SIZE[iconSize] || iconSize}px;
  height: ${({ iconSize }) => COMMUN_ICON_SIZE[iconSize] || iconSize}px;

  color: ${({ theme }) => theme.colors.blue};

  ${is('isLightBackground')`
    color: ${({ theme }) => theme.colors.lightBlue};
  `};
`;

const IconWrapper = styled.div``;

const AvatarStyled = styled(Avatar)`
  ${is('withBorder')`
    & img {
      border: 2px solid #fff;
      border-radius: 50%;
    }
  `};
`;

const PointAvatar = ({
  className,
  point,
  size,
  withBorder,
  cmnWithLightBackground,
  profileAvatarUrl,
}) => {
  switch (point.symbol) {
    case COMMUN_SYMBOL:
      return (
        <IconWrapper className={className}>
          <CommunIcon iconSize={size} isLightBackground={cmnWithLightBackground} />
        </IconWrapper>
      );

    case 'FEED':
      return (
        <AvatarStyled
          size={size}
          avatarUrl={profileAvatarUrl}
          name={point.name}
          withBorder={withBorder}
          className={className}
        />
      );

    default:
      return (
        <AvatarStyled
          size={size}
          avatarUrl={point.logo}
          name={point.name}
          withBorder={withBorder}
          className={className}
        />
      );
  }
};

PointAvatar.propTypes = {
  point: PropTypes.object.isRequired,
  size: PropTypes.string,
  profileAvatarUrl: PropTypes.string,
  withBorder: PropTypes.bool,
  cmnWithLightBackground: PropTypes.bool,
};

PointAvatar.defaultProps = {
  size: 'large',
  profileAvatarUrl: '',
  withBorder: false,
  cmnWithLightBackground: false,
};

export default PointAvatar;
