import styled from 'styled-components';
import is from 'styled-is';
import { rgba } from 'polished';

import { styles } from '@commun/ui';

export const SubTitle = styled.p`
  margin-top: 12px;
  line-height: 20px;
  font-size: 17px;
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
  margin-top: 70px;
  color: #fff;

  ${({ theme }) => `
    background-color: ${theme.colors.blue};

    &:hover,
    &:focus {
      background-color: ${rgba(theme.colors.blue, 0.8)};
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
  position: absolute;
  bottom: -36px;
  max-width: 100%;
  line-height: 20px;
  font-size: 15px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.errorTextRed};
  ${styles.overflowEllipsis};
`;

export const Input = styled.input`
  width: 100%;
  padding: 18px 16px;
  border-radius: 8px;
  line-height: 20px;
  font-size: 17px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray};
  }

  ${styles.overflowEllipsis};
`;
