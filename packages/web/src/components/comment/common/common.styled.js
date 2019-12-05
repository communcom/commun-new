import styled from 'styled-components';
import is from 'styled-is';

// eslint-disable-next-line import/prefer-default-export
export const ActionButton = styled.button.attrs({ type: 'button' })`
  font-size: 13px;
  font-weight: 600;
  transition: color 0.15s;
  color: ${({ theme }) => theme.colors.blue};

  ${is('inPost')`
    height: 34px;
    line-height: 18px;
  `};
`;
