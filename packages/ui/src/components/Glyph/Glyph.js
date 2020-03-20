import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';

import { up } from '../../utils/mediaQuery';
// TODO fix icons size
const SIZE = {
  xs: 20,
  small: 30,
  medium: 40,
  large: 50,
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${({ size }) => SIZE[size]}px;
  height: ${({ size }) => SIZE[size]}px;
  min-width: ${({ size }) => SIZE[size]}px;

  background-color: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  transition: color 0.15s;

  ${is('isDisabled')`
    color: #fff;

    ${up.mobileLandscape} {
      color: ${({ theme }) => theme.colors.gray};
    }
  `};
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

const CrossIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 14px;
  height: 14px;
`;

const ArrowIcon = styled(Icon).attrs({ name: 'long-arrow' })`
  width: 16px;
  height: 16px;
`;

const ConvertIcon = styled(Icon).attrs({ name: 'convert' })`
  width: 20px;
  height: 20px;
`;

const SwapIcon = styled(Icon).attrs({ name: 'change' })`
  width: 25px;
  height: 25px;
`;

const CardIcon = styled(Icon).attrs({ name: 'card' })`
  width: 18px;
  height: 12px;
  color: ${({ theme }) => theme.colors.blue};
`;

const UsdIcon = styled(Icon).attrs({ name: 'usd' })`
  width: 20px;
  height: 20px;
`;

const GLYPH_ICONS = {
  add: <AddIcon />,
  commun: <CommunIcon />,
  cross: <CrossIcon />,
  arrow: <ArrowIcon />,
  convert: <ConvertIcon />,
  swap: <SwapIcon />,
  card: <CardIcon />,
  usd: <UsdIcon />,
};

const Glyph = ({ className, icon, size, isDisabled }) => (
  <Wrapper size={size} isDisabled={isDisabled} className={className}>
    {GLYPH_ICONS[icon]}
  </Wrapper>
);

Glyph.propTypes = {
  icon: PropTypes.oneOf(Object.keys(GLYPH_ICONS)).isRequired,
  size: PropTypes.oneOf(['xs', 'small', 'medium', 'large']),
  isDisabled: PropTypes.bool,
};

Glyph.defaultProps = {
  size: 'large',
  isDisabled: false,
};

export default Glyph;
