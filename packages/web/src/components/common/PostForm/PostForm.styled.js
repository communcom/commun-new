import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { styles, up } from '@commun/ui';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 100%;
`;

export const AddImgModal = styled.label`
  position: relative;
  display: flex;
  color: ${({ theme, communityPage }) =>
    communityPage ? theme.colors.communityColor : theme.colors.contextBlue};
  transition: color 0.15s;
  cursor: pointer;
  overflow: hidden;

  &:hover,
  &:focus {
    color: ${({ theme, communityPage }) =>
      communityPage ? theme.colors.communityColorHover : theme.colors.contextBlueHover};
  }
`;

export const IconAddImg = styled(Icon)`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export const IconEmoji = styled(Icon)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

export const FileInput = styled.input`
  ${styles.visuallyHidden};

  &:hover + label,
  &:focus + label {
    color: ${({ theme, communityPage }) =>
      communityPage ? theme.colors.communityColorHover : theme.colors.contextBlueHover};
  }
`;

export const CrossIcon = styled(Icon).attrs({
  size: '12px',
})``;

export const CloseEditor = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 16px;
  top: -40px;
  width: 24px;
  height: 24px;
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;

  &:hover,
  &:focus {
    border: 1px solid #ffffff;
  }

  & ${CrossIcon} {
    color: #ffffff;
  }

  ${up.tablet} {
    display: none;
  }
`;
