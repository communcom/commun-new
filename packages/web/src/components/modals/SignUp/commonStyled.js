import styled from 'styled-components';
import is from 'styled-is';
import { rgba } from 'polished';

import { styles } from '@commun/ui';

export const Title = styled.h2`
  margin: 10px 0;
  font-size: 32px;
  font-weight: bold;
`;

export const SubTitle = styled.p`
  margin-top: 12px;
  line-height: 24px;
  font-size: 17px;
  text-align: center;

  .bold {
    font-weight: bold;
  }
`;

const ActionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  width: 100%;
  max-width: 304px;
  border-radius: 8px;
  transition: color 150ms, background-color 150ms;

  ${is('disable')`
    cursor: auto;
    pointer-events: none;
  `};
`;

export const SendButton = styled(ActionButton)`
  color: #fff;

  ${({ theme }) => `
    background-color: ${theme.colors.blue};

    &:hover,
    &:focus {
      background-color: ${rgba(theme.colors.blue, 0.8)};
    }

    &:disabled {
      background-color: ${theme.colors.gray} !important;
    }
  `};
`;

export const BackButton = styled(ActionButton).attrs({ type: 'button' })`
  margin-top: 12px;

  ${({ theme }) => `
    color: ${theme.colors.blue};

    &:hover,
    &:focus {
      color: ${rgba(theme.colors.blue, 0.8)};
    }
  `};
`;

export const ErrorText = styled.span`
  line-height: 20px;
  font-size: 15px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.errorTextRed};
  ${styles.overflowEllipsis};
`;

export const ErrorTextAbsolute = styled(ErrorText)`
  position: absolute;
  left: 50%;
  bottom: -36px;
  max-width: 100%;
  transform: translateX(-50%);
`;

export const InputWrapper = styled.label`
  display: flex;
  max-height: 56px;
  margin: 12px 0 20px;
  border: 1px solid ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  cursor: text;
  transition: border-color 0.15s, background-color 0.15s;

  ${({ error, focused, theme }) => `
    color: ${theme.colors.black};
    ${
      error
        ? `
          border-color: ${theme.colors.errorTextRed};
        `
        : ``
    };
    ${
      focused
        ? `
          border-color: ${theme.colors.lightGray};
          background-color: #fff;
        `
        : ``
    };
  `};
`;

export const Input = styled.input`
  width: 100%;
  padding: 18px 16px;
  border-radius: 8px;
  line-height: 20px;
  font-size: 17px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  ${styles.overflowEllipsis};
  transition: background-color 0.15s;

  &:focus {
    background-color: #fff;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray};
    opacity: 1;
  }
`;
