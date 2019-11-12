import styled from 'styled-components';
import is from 'styled-is';

export default styled.button.attrs({ type: 'button' })`
  min-width: 70px;
  height: 34px;
  padding: 0 15px;
  border-radius: 100px;
  line-height: 1;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.blue};
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  ${is('small')`
    height: 30px;
  `};

  ${is('primary')`
    color: #fff;
    background-color: ${({ theme }) => theme.colors.blue};
    
    &:hover,
    &:focus {
      background-color: ${({ theme }) => theme.colors.blueHover};
    }
  `};

  ${is('hollow')`
    ${({ theme }) => `
      color: ${theme.colors.blue};
      border: 1px solid ${theme.colors.blue};
    `};
    background-color: ${({ theme }) => theme.colors.white};
    
    &:hover,
    &:focus {
      background-color: ${({ theme }) => theme.colors.lightGrayBlue};
    }
  `};
`;
