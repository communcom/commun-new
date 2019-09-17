import styled from 'styled-components';
import is from 'styled-is';
import { rgba } from 'polished';

import { styles } from '@commun/ui';

export const SubTitle = styled.p`
  margin-top: 12px;
  line-height: 20px;
  font-size: 17px;
  letter-spacing: -0.41px;
`;

const ActionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  width: 100%;
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
    background-color: ${theme.colors.contextBlue};
  
    &:hover,
    &:focus {
      background-color: ${rgba(theme.colors.contextBlue, 0.8)};
    }
  `};
`;

export const BackButton = styled(ActionButton)`
  margin-top: 12px;

  ${({ theme }) => `
    color: ${theme.colors.contextBlue};
    
    &:hover,
    &:focus {
      color: ${rgba(theme.colors.contextBlue, 0.8)};
    }
  `};
`;

export const ErrorText = styled.span`
  position: absolute;
  bottom: -36px;
  max-width: 100%;
  line-height: 20px;
  font-size: 15px;
  letter-spacing: -0.41px;
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
  letter-spacing: -0.41px;
  background-color: ${({ theme }) => theme.colors.contextWhite};

  &::placeholder {
    color: ${({ theme }) => theme.colors.contextGrey};
  }

  ${styles.overflowEllipsis};
`;

export const Circle = styled.div`
  width: 160px;
  height: 160px;
  margin-top: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.contextWhite};
`;

export const LastScreenTitle = styled.h3`
  margin-top: 24px;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: -0.41px;
  text-align: center;
`;

export const LastScreenSubTitle = styled.p`
  margin-top: 12px;
  font-size: 15px;
  letter-spacing: -0.41px;
  text-align: center;
  color: ${({ theme }) => theme.colors.contextGrey};
`;
