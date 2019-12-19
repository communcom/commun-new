import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Avatar } from '@commun/ui';

import { COMMUN_SYMBOL } from 'shared/constants';

const COMMUN_ICON_SIZE = {
  xs: 20,
  large: 50,
};

const CommunIcon = styled(Icon).attrs({ name: 'commun' })`
  width: ${({ iconSize }) => COMMUN_ICON_SIZE[iconSize]}px;
  height: ${({ iconSize }) => COMMUN_ICON_SIZE[iconSize]}px;

  color: ${({ theme }) => theme.colors.blue};
`;

const IconWrapper = styled.div``;

const PointAvatar = ({ className, point, size }) =>
  point.symbol === COMMUN_SYMBOL ? (
    <IconWrapper className={className}>
      <CommunIcon iconSize={size} />
    </IconWrapper>
  ) : (
    <Avatar size={size} avatarUrl={point.logo} name={point.name} className={className} />
  );

PointAvatar.propTypes = {
  point: PropTypes.object.isRequired,
  size: PropTypes.string,
};

PointAvatar.defaultProps = {
  size: 'large',
};

export default PointAvatar;
