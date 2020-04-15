import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { CloseButton, up } from '@commun/ui';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 502px;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  padding: 20px 12px;
  background-color: ${({ theme }) => theme.colors.white};

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

  ${is('isCentered')`
    ${up.mobileLandscape} {
      justify-content: center;
    }
  `};
`;

export const ModalName = styled.h2`
  font-size: 16px;
  line-height: 22px;
  text-align: center;
`;

export const DescriptionInputWrapper = styled.div`
  position: relative;
  display: flex;
`;

export const DescriptionInput = styled.textarea`
  flex-grow: 1;
  width: 100%;
  min-height: 172px;
  padding: 10px 15px;
  border-radius: 10px;
  line-height: 24px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black};
  background: transparent;
  border: 1px solid #e2e6e8;
  resize: none;

  ${up.mobileLandscape} {
    font-size: 15px;
  }
`;

export const DescriptionLength = styled.div`
  position: absolute;
  bottom: 10px;
  right: 5px;
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.colors.black};
  border-radius: 30px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
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
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  transition: background-color 0.15s;

  &:hover,
  &:focus {
    color: #fff;
    background-color: ${({ theme }) => theme.colors.blueHover};
  }

  ${isNot('isChanged')`
    &:hover, &:focus {
      color: ${({ theme }) => theme.colors.black};
      background-color: ${({ theme }) => theme.colors.lightGrayBlue};
    }
  `};
`;

export const CloseButtonStyled = styled(CloseButton)`
  display: none;

  ${up.mobileLandscape} {
    display: flex;
  }

  ${is('isAbsolute')`
    position: absolute;
    top: 0;
    right: 0;
  `};
`;

export const BackButton = styled(CloseButton).attrs({ isBack: true })`
  position: absolute;
  top: 0;
  left: 0;

  ${up.mobileLandscape} {
    display: none;
  }
`;
