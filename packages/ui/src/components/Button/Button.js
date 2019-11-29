import styled from 'styled-components';
import is from 'styled-is';

const Button = styled.button`
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

  ${is('big')`
    height: 50px;
    font-size: 14px;
  `};

  ${is('primary')`
    color: #fff;
    background-color: ${({ theme }) => theme.colors.blue};

    &:hover,
    &:focus {
      background-color: ${({ theme }) => theme.colors.blueHover};
    }

    &:active {
      background-color: ${({ theme }) => theme.colors.blueActive};
    }

    &:disabled {
      background-color: ${({ theme }) => theme.colors.gray};
    }
  `};

  ${is('danger')`
    color: #fff;
    background-color: ${({ theme }) => theme.colors.lightRed};
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

Button.defaultProps = {
  type: 'button',
};

export default Button;
