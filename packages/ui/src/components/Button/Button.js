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
  transition: background-color 0.15s;
  appearance: none;

  ${is('full')`
    width: 100%;
  `};

  ${is('small')`
    height: 30px;
  `};

  ${is('medium')`
    height: 40px;
    font-size: 14px;
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
  `};

  ${is('danger')`
    color: #fff;
    background-color: ${({ theme }) => theme.colors.lightRed};
  `};

  ${is('hollow')`
    color: ${({ theme }) => theme.colors.blue};
    border: 1px solid #e2e6e8;
    background-color: transparent;
    transition: background-color 0.15s, border 0.15s;

    ${is('transparent')`
      border: none;
    `};

    ${is('blue')`
      border: 1px solid ${({ theme }) => theme.colors.blue};
      background-color: ${({ theme }) => theme.colors.white};
    `}

    &:hover,
    &:focus {
      background-color: ${({ theme }) => theme.colors.lightGrayBlue};
    }
  `};

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
  }
`;

Button.defaultProps = {
  type: 'button',
};

export default Button;
