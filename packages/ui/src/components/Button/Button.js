import styled from 'styled-components';
import is from 'styled-is';

export default styled.button.attrs({ type: 'button' })`
  min-width: 70px;
  height: 34px;
  padding: 0 15px;
  border-radius: 34px;
  line-height: 1;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 0.6px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.contextBlue};
  background: ${({ theme }) => theme.colors.contextWhite};

  ${is('primary')`
    color: #fff;
    background: ${({ theme }) => theme.colors.contextBlue};
  `};
`;
