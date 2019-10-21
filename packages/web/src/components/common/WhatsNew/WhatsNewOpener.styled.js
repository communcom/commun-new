import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { styles, up } from '@commun/ui';

export const ADDITIONAL_BREAKPOINT_MOBILE = 500;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  ${styles.breakWord};

  ${up.tablet} {
    border-radius: 6px;
  }

  ${is('open')`
    position: fixed;
    top: 64px;
    bottom: 0;
    z-index: 105;
    width: 100%;
    margin-bottom: 0;

    @media (min-width: ${ADDITIONAL_BREAKPOINT_MOBILE + 1}px) {
      position: relative;
      top: auto;
      bottom: auto;
      // height: 150px;
      margin-bottom: 8px;
    }
  `};
`;

export const Left = styled.div`
  display: flex;
  flex-grow: 1;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
`;

export const ClosedEditorPlaceholder = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  flex-grow: 1;
  font-size: 15px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.contextGrey};
  cursor: text;
`;

export const AddImg = styled.button`
  display: flex;
  padding: 3px;
  margin-left: 6px;
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
  width: 19px;
  height: 19px;
  cursor: pointer;
`;

export const EditorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  padding: 12px 16px;
`;

export const BackgroundShadow = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);

  @media (min-width: ${ADDITIONAL_BREAKPOINT_MOBILE + 1}px) {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;
