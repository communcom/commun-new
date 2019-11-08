import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { CloseButton, up } from '@commun/ui';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 502px;
  padding: 20px 12px;
  height: 100vh;
  background-color: #fff;

  ${up.mobileLandscape} {
    padding: 16px 20px 20px;
    border-radius: 15px;
  }

  ${up.tablet} {
    height: auto;
  }
`;

export const DescriptionBlock = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-bottom: 20px;
`;

export const DescriptionHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;

  ${up.mobileLandscape} {
    justify-content: space-between;
  }
`;

export const ModalName = styled.h2`
  font-size: 16px;
  line-height: 22px;
  text-align: center;
`;

export const DescriptionInput = styled.textarea`
  flex-grow: 1;
  width: 100%;
  min-height: 172px;
  padding: 10px 15px;
  border-radius: 10px;
  line-height: 24px;
  font-size: 15px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  resize: none;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;

  & > * {
    flex-grow: 1;
    flex-basis: 100px;
  }

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

export const Button = styled.button.attrs({
  type: 'button',
})`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  padding: 18px 12px;
  border-radius: 100px;
  font-weight: bold;
  font-size: 14px;
  line-height: 100%;
`;

export const SaveButton = styled(Button)`
  color: #fff;
  background-color: ${({ theme }) => theme.colors.blue};
  transition: background-color 0.15s;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.blueHover};
  }

  ${is('insideAsyncAction')`
    width: 100%;
  `};

  ${isNot('isChanged')`
    &, &:hover, &:focus {
      background-color: ${({ theme }) => theme.colors.gray};
    }
  `};
`;

export const ResetButton = styled(Button)`
  color: #000;
  background-color: ${({ theme }) => theme.colors.background};
  transition: background-color 0.15s;

  &:hover,
  &:focus {
    color: #fff;
    background-color: ${({ theme }) => theme.colors.blueHover};
  }

  ${isNot('isChanged')`
    &:hover, &:focus {
      color: #000;
      background-color: ${({ theme }) => theme.colors.background};
    }
  `};
`;

export const CloseButtonStyled = styled(CloseButton)`
  display: none;

  ${up.mobileLandscape} {
    display: flex;
  }
`;

export const BackButton = styled(CloseButton).attrs({ isBack: true })`
  position: absolute;
  top: 0;
  left: 0;

  ${up.mobileLandscape} {
    display: none;
  }
`;
