import React from 'react';
import PropTypes from 'prop-types';
import by from 'styled-by';
import styled from 'styled-components';

import { Glyph } from '@commun/ui';

export const GlyphStyled = styled(Glyph)`
  margin-right: 10px;

  ${by('icon', {
    _: ({ theme }) => `
      color: ${theme.colors.blue};
      background-color: ${theme.colors.lightGrayBlue};

      & > svg {
        width: 28px;
        height: 28px;
      }
    `,
    commun: `
      & > svg {
        width: 8px;
        height: 19px;
      }
    `,
  })}

  ${({ theme, isMobile, isActive }) =>
    isMobile
      ? `
        color: ${isActive ? theme.colors.lightBlue : '#fff'};
        background-color: ${isActive ? theme.colors.lightGrayBlue : theme.colors.lightBlue};
      `
      : ''}
`;

export default function CurrencyGlyph({ currency, size, isActive, isMobile, ...props }) {
  const iconName = currency === 'CMN' ? 'commun' : currency.toLowerCase();

  return (
    <GlyphStyled icon={iconName} size={size} isActive={isActive} isMobile={isMobile} {...props} />
  );
}

CurrencyGlyph.propTypes = {
  currency: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  isMobile: PropTypes.bool,
};

CurrencyGlyph.defaultProps = {
  isActive: false,
  isMobile: false,
};
