import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

const SIZE = {
  xs: 20,
  small: 32,
  medium: 40,
  large: 50,
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${({ size }) => SIZE[size]}px;
  height: ${({ size }) => SIZE[size]}px;

  background-color: ${({ theme }) => theme.colors.blue};
  color: #fff;
  border-radius: 50%;
`;

const AddIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 20px;
  height: 20px;

  transform: rotate(45deg);
`;

const CommunIcon = styled(Icon).attrs({ name: 'slash' })`
  width: 7px;
  height: 16px;
`;

const GLYPH_ICONS = {
  add: <AddIcon />,
  commun: <CommunIcon />,
};

const Glyph = ({ className, icon, size }) => (
  <Wrapper size={size} className={className}>
    {GLYPH_ICONS[icon]}
  </Wrapper>
);

Glyph.propTypes = {
  icon: PropTypes.oneOf(['add', 'commun']).isRequired,
  size: PropTypes.oneOf(['xs', 'small', 'medium', 'large']),
};

Glyph.defaultProps = {
  size: 'large',
};

export default Glyph;
